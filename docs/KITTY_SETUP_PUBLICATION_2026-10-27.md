# Kitty setup guide: provenance and validation

Published configuration scope: macOS, Kitty 0.48.2, Zsh 5.9.

Inspected only the relevant terminal files: Kitty config/theme/tab renderer and its
old README; Zsh startup files; Yazi previewer/openers, package manifest and Piper;
Glow preferences; selected global Git pager settings; installed tool versions and
MesloLGS NF font filenames. Did not read shell history or SSH credentials/config.
Did not modify the active terminal configuration or running Kitty sessions.

## Findings carried into the article

- No configured Powerlevel10k/Starship. Powerline visuals belong to Kitty's tab bar.
- Cmd+W is close_tab, not close_window. Ctrl+Shift+W closes the pane.
- Cmd+Shift+D overrides the macOS default with the user's horizontal split action.
- Option+Command+arrows and Cmd+Shift+Enter are not mapped in the installed snapshot.
  The article separates suggested mappings from the reproduced configuration.
- The custom legend disappears with insufficient width; it uses Python character
  counts rather than precise terminal-cell-width accounting.
- Broad remote control and disabled close confirmation are preserved and disclosed.
- The SSH wrapper restores hard-coded local colors; it is a cue, not a host identity
  or transport-security check. TERM fallback does not configure remote applications.
- Yazi Markdown previews depend on Piper and Glow, not merely the Kitty color theme.
- Only two personal absolute executable paths are templated. The preparation helper
  resolves them within the extracted bundle and does not install live config.
- Piper is vendored at installed revision 9014ed2 with its MIT license.
- Installed versions are documented, not portrayed as a Homebrew lockfile.

## Validation

- Original and prepared Kitty config loaded by installed Kitty's load_config API;
  font, layout, colors, tab style, cursor trail, remote control and selected effective
  key maps matched. No GUI/remote-control commands were sent to Kitty.
- Zsh syntax passed. Isolated shell source exposed expected aliases and fzf/zoxide
  functions; non-PTY ZLE warnings mean interactive key behavior was not tested there.
- Yazi config and package manifest parsed as TOML; TwoDark exists in installed bat.
- ZIP extraction and SHA256SUMS verified; prepare.py resolved paths in scratch only.
- Public bundle scanned for personal absolute paths, credentials and private hosts.
- Official references/release links returned HTTP 200. The repository bundle link
  naturally returns 404 until this new source commit is pushed.
- Next build and static export passed. Existing warnings: stale Browserslist data
  and inability to inline Google Fonts in the sandbox; no compilation failure.
- Browser review: desktop and 390px mobile, no document overflow, all seven anchors
  resolved, all fourteen code blocks scroll locally, diagram loaded, no console errors.

## Screenshots

Computer-use access to Kitty was denied by the tool. No alternative capture path
was used. No generated image is presented as a terminal screenshot. The article
includes a labelled SVG configuration diagram. User-supplied screenshots can be
added after checking visible commands, paths, tokens and host information.

## Delivery

Article: /blog/my-kitty-terminal-setup/
Download: /downloads/kitty-setup.zip
Source files: public/downloads/kitty-setup/

No changes to Velocita, trading services, credentials or the existing experience entry.
