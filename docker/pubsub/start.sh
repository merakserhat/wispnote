#!/usr/bin/env bash
set -e

PROJECT=wispnote-local
BASE=http://localhost:8085/v1/projects/$PROJECT
PUSH_BASE_URL=${ANALYZER_PUSH_BASE_URL:-http://analyzer:8096}

gcloud beta emulators pubsub start --project=$PROJECT --host-port=0.0.0.0:8085 &
EMULATOR_PID=$!
trap 'kill $EMULATOR_PID' TERM INT

until curl -fs http://localhost:8085 >/dev/null; do sleep 1; done

put() {
  curl -fs -X PUT "$BASE/$1" -H 'Content-Type: application/json' -d "$2" >/dev/null
}

create_flow() {
  topic=$1
  path=$2
  subscription=$topic-analyzer
  dead=$subscription-dead

  put "topics/$topic" '{}'
  put "topics/$dead" '{}'
  put "subscriptions/$dead-pull" "{\"topic\":\"projects/$PROJECT/topics/$dead\"}"
  put "subscriptions/$subscription" "{
    \"topic\":\"projects/$PROJECT/topics/$topic\",
    \"pushConfig\":{\"pushEndpoint\":\"$PUSH_BASE_URL/pubsub/$path\"},
    \"ackDeadlineSeconds\":600,
    \"retryPolicy\":{\"minimumBackoff\":\"10s\",\"maximumBackoff\":\"600s\"},
    \"deadLetterPolicy\":{\"deadLetterTopic\":\"projects/$PROJECT/topics/$dead\",\"maxDeliveryAttempts\":10}
  }"
}

create_flow wispnote-notes notes
create_flow wispnote-automations automations

touch /tmp/ready
wait $EMULATOR_PID
