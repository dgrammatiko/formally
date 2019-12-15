---
layout: layouts/docs.njk
title: Formally documented - Input
postsHeading: A tiny wrapper around the HTML5 native validation
socialImage: ''
---

|Attribute|Input types supporting the attribute|Possible values|Constraint description|Associated violation|
|--- |--- |--- |--- |--- |
|pattern|text, search, url, tel, email, password|A JavaScript regular expression (compiled with the ECMAScript 5 global, ignoreCase, and multiline flags disabled)|The value must match the pattern.|patternMismatch constraint violation|
|min|range, number|A valid number|The value must be greater than or equal to the value.|rangeUnderflow constraint violation|
|date, month, week|A valid date||||
|datetime, datetime-local, time|A valid date and time||||
|max|range, number|A valid number|The value must be less than or equal to the value|rangeOverflow constraint violation|
|date, month, week|A valid date||||
|datetime, datetime-local, time|A valid date and time||||
|required|text, search, url, tel, email, password, date, datetime, datetime-local, month, week, time, number, checkbox, radio, file; also on the {{ HTMLElement("select") }} and {{ HTMLElement("textarea") }} elements|none as it is a Boolean attribute: its presence means true, its absence means false|There must be a value (if set).|valueMissing constraint violation|
|step|date|An integer number of days|Unless the step is set to the any literal, the value must be min + an integral multiple of the step.|stepMismatch constraint violation|
|month|An integer number of months||||
|week|An integer number of weeks||||
|datetime, datetime-local, time|An integer number of seconds||||
|range, number|An integer||||
|minlength|text, search, url, tel, email, password; also on the {{ HTMLElement("textarea") }} element|An integer length|The number of characters (code points) must not be less than the value of the attribute, if non-empty. All newlines are normalized to a single character (as opposed to CRLF pairs) for {{ HTMLElement("textarea") }}.|tooShort constraint violation|
|maxlength|text, search, url, tel, email, password; also on the {{ HTMLElement("textarea") }} element|An integer length|The number of characters (code points) must not exceed the value of the attribute.|tooLong constraint violation|
