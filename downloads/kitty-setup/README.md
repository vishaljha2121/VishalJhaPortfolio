# My Kitty setup: configuration snapshot

Inspected 2026-10-27. macOS / Apple Silicon, Kitty 0.48.2, Zsh 5.9.
See versions.json for the installed tool versions. This is a configuration bundle,
not a binary lockfile or a clean-machine installation test. Homebrew installs its
current releases, which may differ. Use the matching official release tags if
matching versions is important. Font files and tool binaries are not redistributed.

Kitty/theme.conf and tab_bar.py match the local originals. The .in files replace
only two personal executable paths with markers. prepare.py resolves those paths
in this extracted bundle; it never writes your real configuration. The shell
snippet keeps the original commands; an over-broad SSH comment was corrected.
The original tutorial was omitted because several shortcut claims were stale.
The Piper plugin and MIT license are included at the recorded installed revision.

Read the full guide at:
https://vishaljha2121.github.io/VishalJhaPortfolio/blog/my-kitty-terminal-setup/

## Before installation

Install Kitty, bat, glow, lsd, yazi, fzf, zoxide, git-delta, fastfetch and Python 3.
Install the four MesloLGS NF fonts from romkatv/powerlevel10k-media (font only;
Powerlevel10k is not used by this setup). fzf --zsh requires fzf 0.48 or later.
Run python3 prepare.py from this folder. Inspect its two generated files.

This snapshot preserves allow_remote_control yes and listen_on unix:/tmp/mykitty.
Programs with access can control the terminal. No workflow here requires that
permission: for a safer variant use allow_remote_control no and remove listen_on.
confirm_os_window_close 0 disables close confirmation. Cmd+W closes the TAB.
Review these choices before copying any files. We did not change the author's
installed configuration when preparing this guide.

## Back up and install manually

Run commands from the extracted kitty-setup directory. These commands assume
standard ~/.config paths, not a custom XDG_CONFIG_HOME/ZDOTDIR. Existing setups
should merge the files instead of replacing their own customizations.

```sh
backup="$HOME/terminal-backup-$(date +%Y%m%d-%H%M%S)"
mkdir "$backup"
for item in "$HOME/.config/kitty" "$HOME/.config/yazi" "$HOME/.config/terminal-setup" "$HOME/.zshrc" "$HOME/.gitconfig" "$HOME/Library/Preferences/glow"; do
    if [ -e "$item" ]; then cp -Rp "$item" "$backup/"; fi
done
printf 'Backup: %s\n' "$backup"
mkdir -p "$HOME/.config/kitty" "$HOME/.config/yazi/plugins/piper.yazi" "$HOME/.config/terminal-setup" "$HOME/Library/Preferences/glow"
cp kitty/kitty.conf kitty/theme.conf kitty/tab_bar.py "$HOME/.config/kitty/"
cp yazi/yazi.toml "$HOME/.config/yazi/"
cp yazi/plugins/piper.yazi/main.lua yazi/plugins/piper.yazi/LICENSE "$HOME/.config/yazi/plugins/piper.yazi/"
cp shell/terminal.zsh "$HOME/.config/terminal-setup/"
cp glow/glow.yml "$HOME/Library/Preferences/glow/"
```

Do not overwrite an existing Yazi package.toml. This bundle installs Piper's
files directly; package.toml is provenance, not a command to update the plugin.
If you already manage Piper through ya, reconcile that entry manually first.
Append once to ~/.zshrc, after other aliases/plugin initialization:

```sh
source "$HOME/.config/terminal-setup/terminal.zsh"
```

If another file already initializes fzf or zoxide, keep only one initializer.
Apply the four settings in gitconfig.fragment with git config --global, or merge
that fragment into your existing file. Do not replace the whole .gitconfig.
Open a fresh Kitty window after saving work; no reboot is needed.
To roll back, restore only the files you changed from the printed backup directory.

## Checks

- kitty --version; bat --version; glow --version; yazi --version
- command -v bat glow lsd yazi fzf zoxide delta fastfetch
- bat --list-themes (look for TwoDark)
- alias cat ls md; whence -w fzf-history-widget z
- Ctrl+Shift+W closes a pane; Cmd+W closes a tab.
- Cmd+D splits side by side; Cmd+Shift+D stacks panes.
- Ctrl+Shift+[ / ] changes panes; Shift+Cmd+[ / ] changes tabs.
- The legend's Option+Cmd+arrow reminder is NOT mapped in this snapshot.
- Cmd+Shift+Enter is NOT mapped here; Ctrl+Shift+L cycles enabled layouts.
- Cmd+B opens Yazi; Markdown previews require the included Piper plugin.
- Test in examples/; do not photograph real history, credentials or SSH hosts.

Snapshots are not screenshots. No terminal screenshot is bundled.
