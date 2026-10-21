# Settings UX Rationale

## Product model

Zima Display is a single-device, single-screen appliance. Its primary job is not to manage settings or build a signage network. It is:

> Choose content, preview it, and show it on HDMI.

The settings dialog supports device configuration without pretending to be a setup wizard:

> Manage startup behavior, output compatibility, media playback defaults and connected data sources.

Users should not need to understand renderer backends, media permissions, or a settings taxonomy before completing that job.

## Research findings

- Apple Human Interface Guidelines recommend useful defaults, asking for as little configuration as possible, and placing task-specific controls close to the task: <https://developer.apple.com/design/human-interface-guidelines/settings>
- Nielsen Norman Group recommends progressive disclosure: show the primary task first and reveal specialized or error-prone controls only when requested: <https://www.nngroup.com/articles/progressive-disclosure/>
- Screenly organizes digital signage around assets, playlists, and screens: <https://www.screenly.io/docs/get-started/overview/>
- Yodeck similarly separates content, playlists, screen assignment, and preview: <https://www.yodeck.com/docs/user-manual/screen-playlists/> and <https://www.yodeck.com/docs/user-manual/how-do-i-preview-whats-displayed-on-the-tv-before-pushing-the-content/>

The Screenly/Yodeck model is appropriate for fleets and scheduled signage. Copying it into Zima Display would add unnecessary objects and navigation. Zima Display has one local HDMI target, so "content -> playlist -> screen" is compressed into "choose -> preview -> display."

## Applied decisions

- Make the home page start with one question and three mutually exclusive content paths: ready-made views, free canvas, or media.
- Show only the selected workspace; canvas editing and media browsing never appear together.
- Treat Dashboard and Clock as ready-made views rather than separate top-level product modes.
- Keep Black standby and Restore terminal under screen maintenance instead of presenting them as content.
- Keep the live-screen disclosure limited to the HDMI preview and current output context.
- Capture media previews from the active mpv renderer so Current screen reflects the actual video, slideshow or presentation frame instead of recreating playback in the browser.
- Keep playback controls inside the Media workspace, where they are needed.
- Remove device metrics from the control-page inspection area; metrics are display content, not screen-confirmation controls.
- Put Black standby and Restore terminal in a collapsed Screen maintenance section in Settings.
- Manage remote SSH data sources in Settings, then select a source only on CPU, memory, storage, temperature, network, IP, and hostname canvas widgets.
- Avoid a top-level cluster mode until the product includes fleet-level jobs such as alerts, history, or batch operations.
- Keep the three canvas templates visible as starting points before exposing detailed editing controls.
- Remove the three settings categories and their tab navigation.
- Open with the conventional title "Settings" and a short scope description.
- Make startup content and automatic startup the only always-visible controls.
- Keep dashboard appearance and preview on the main Ready-made workspace, beside the content it edits, with separate Save and Save-and-show actions like Free canvas.
- Keep Settings startup behavior limited to choosing which already-configured mode opens after boot.
- Put renderer, resolution, and audio controls under the noun label "Display output," not a support-style question.
- Put persistent playback defaults in a collapsed Media playback disclosure: single-video end behavior, collection end behavior and slideshow timing.
- Keep media folders at the bottom of Media playback and describe them as browser access scope, not playback behavior.
- Keep DRM, automatic resolution, and automatic audio as the recommended path.
- Show current display connection, connector, and active content as context, not as another task.
- Use one primary action, "Save settings." Saving startup preferences must not switch, blank or restart the current output.
- Distinguish current output from default startup view: the former is read-only context, while the latter takes effect after a future restart when automatic startup is enabled.
- Keep the live dashboard preview as a safety mechanism before changing physical HDMI output.
- Preserve all configuration field IDs and API mappings to minimize regression risk.

## Interaction standard

The default path is:

1. Open Settings.
2. Adjust startup behavior if needed.
3. Optionally keep automatic startup enabled.
4. Open Display output, Media playback, Remote device data or Screen maintenance only when needed.
5. Save settings without disrupting the current screen.

Dashboard appearance is not part of this flow. It is edited from the main Ready-made workspace, where the user can preview, save, or save and show it on HDMI.

The Media workspace owns immediate actions such as selecting files, starting playback and temporarily changing the current slideshow interval. Settings owns persistent defaults that apply to future playback sessions.

Advanced controls must not interrupt this path. A user who never opens either disclosure must still be able to complete the product's primary setup successfully.

## Follow-up opportunities

- Replace the audio-device text field with detected choices when the backend can expose them reliably.
- Add a first-run HDMI check that identifies the display, renders a test image, and confirms visibility.
- Add browser-driven accessibility and visual-regression tests for the dialog at desktop and mobile widths.
- Add device-backed named canvas templates if users need more than the three built-in starting points and one saved canvas.
