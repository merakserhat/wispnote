package com.wispnote.analyzer.application.note;

import com.wispnote.analyzer.application.note.model.NoteEvent;

import java.time.Duration;
import java.util.function.Consumer;

public interface NoteAggregationWindowPort {

    void collectIntoWindow(Long noteId, Duration windowTimeout, NoteEvent noteEvent, Consumer<NoteEvent> onWindowClose);
}
