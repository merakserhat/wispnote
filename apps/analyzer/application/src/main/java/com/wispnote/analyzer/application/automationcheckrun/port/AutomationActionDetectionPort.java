package com.wispnote.analyzer.application.automationcheckrun.port;

import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionDetectionRequest;
import com.wispnote.analyzer.application.automationcheckrun.model.AutomationActionDetectionResult;

public interface AutomationActionDetectionPort {

    AutomationActionDetectionResult detect(AutomationActionDetectionRequest request);
}
