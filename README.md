# GroupMe Urza's Head bot

## Introduction

This is a simple GroupMe bot that responds to certain posts.
It is hosted on https://www.heroku.com/. 
It uses the https://dev.groupme.com/ API to read and respond to posts.

### Commands

| Command | Response | Inline?   |
|---------|----------|-----------|
| Urza +1 | A random +1 ability. | Whole line | 
| Urza -1 | A random -1 ability. | Whole line |
| Urza -6 | A random -6 ability. | Whole line |
| roll dX | A result between 1 and X | Inline |
| Time(s) HH (CST|PST|EST) | The hours HH converted to all three timezones. | Whole line |
| Time(s) HH:MM | The hours HH converted to all three timezones with the minutes MM appended. | Whole line |

Urza abilities are from the AskUrza.com site responses.