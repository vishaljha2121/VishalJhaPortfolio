export const kittySetupPost = {
    slug: "my-kitty-terminal-setup",
    title: "My Kitty Terminal Setup: The Config, the Tools, and the Rough Edges",
    date: "2026-10-27",
    description: "Reproduce my macOS terminal: Atom One Dark, MesloLGS NF, native Kitty splits, a custom tab bar, Zsh tools and Yazi Markdown previews—with the complete configuration download.",
    tags: ["Kitty", "macOS", "Terminal", "Zsh", "Developer Tools"],
    content: `<div class="terminal-guide">
<p>I spend a lot of time moving between code, build output, Markdown notes and remote machines. I wanted a terminal where those tasks felt connected: split a pane, read a file with formatting, find an old command, and tell at a glance when I had entered SSH.</p>
<p>This is the configuration I use on my Mac: <strong>Kitty, Zsh, Atom One Dark, MesloLGS NF, and a small collection of command-line tools</strong>. There is no Powerlevel10k or Starship prompt in these files. The powerline shapes at the top belong to Kitty’s tab bar, not the shell prompt.</p>
<p>This guide comes from inspecting my actual configuration and installed Kitty 0.48.2. It includes the complete files, portable executable paths and the rough edges I found while checking my old notes. It is a macOS guide; the appearance and shortcuts are not a promise of identical pixels on Linux or a different display.</p>

<p><a class="terminal-download" href="/VishalJhaPortfolio/downloads/kitty-setup.zip" download>Download the complete configuration bundle →</a> <a href="https://github.com/vishaljha2121/VishalJhaPortfolio/tree/master/public/downloads/kitty-setup">Browse the files first</a></p>
<nav aria-label="In this guide"><strong>In this guide</strong><ul><li><a href="#layers">What each layer does</a></li><li><a href="#install">Install and reproduce the setup</a></li><li><a href="#appearance">Font, palette and rendering</a></li><li><a href="#panes">Panes, tabs and the shortcut legend</a></li><li><a href="#shell">Shell tools and Markdown previews</a></li><li><a href="#ssh">The SSH colour switch</a></li><li><a href="#checks">Checks, caveats and troubleshooting</a></li></ul></nav>
<figure><img src="/VishalJhaPortfolio/images/kitty-setup/configuration-map.svg" width="1000" height="520" alt="Configuration map showing Kitty as the window layer, Zsh as the shell, and the reading, navigation and Git tools below it." /><figcaption>Configuration map using my palette. This is an explanatory diagram, not a screenshot of a running terminal.</figcaption></figure>
<h2 id="layers">1. What each layer does</h2><p>Kitty draws the window, glyphs, cursor, panes and tabs. Zsh interprets commands and sets up aliases. The individual programs produce the coloured output. Changing a Kitty theme does not install syntax highlighting, a file browser or a Git pager.</p>
<div class="terminal-table"><table><thead><tr><th>Layer</th><th>My choice</th><th>What it adds</th></tr></thead><tbody><tr><td>Terminal</td><td>Kitty 0.48.2</td><td>Native panes, top tabs, shell integration and a Python tab renderer</td></tr><tr><td>Shell</td><td>Zsh 5.9</td><td>Aliases, fzf bindings, zoxide and an SSH wrapper</td></tr><tr><td>Appearance</td><td>MesloLGS NF, 14 pt; Atom One Dark</td><td>Nerd Font glyphs, a dark palette and blue cursor</td></tr><tr><td>Reading</td><td>bat 0.26.1; Glow 2.1.2</td><td>Syntax-coloured files, man pages and rendered Markdown</td></tr><tr><td>Navigation</td><td>lsd 1.2.0; fzf 0.74.2; zoxide 0.10.0</td><td>File icons, fuzzy selection and directory jumping</td></tr><tr><td>File browser</td><td>Yazi 26.5.6; Piper revision 9014ed2</td><td>Markdown previews through Glow</td></tr><tr><td>Git / optional banner</td><td>delta 0.19.2; fastfetch 2.66.0</td><td>Coloured diffs; system information only when I run ff</td></tr></tbody></table></div>
<h2 id="install">2. Install the tools, then the configuration</h2><p><strong>Version boundary:</strong> those are the versions installed when I inspected the setup on October 27, 2026. Homebrew installs its current releases; it does not reproduce that version list. For a matching-version baseline, use the corresponding official release tags linked below and keep the bundled Piper revision. The bundle reproduces the configuration, not an entire macOS image. I checked these files on my Mac; I have not tested the entire installation on a clean Mac.</p>
<p>With <a href="https://brew.sh/">Homebrew</a> already installed:</p>
<pre><code>brew install --cask kitty
brew install bat glow lsd yazi fzf zoxide git-delta fastfetch python</code></pre>
<p>Install the four <a href="https://github.com/romkatv/powerlevel10k#fonts">MesloLGS NF font files</a>—Regular, Bold, Italic and Bold Italic—using Font Book. This is the font family my config names. A similarly named Nerd Font may need a different <code>font_family</code> value. You do not need to install the Powerlevel10k prompt to use its font.</p>
<p>My Kitty app lives in <code>~/Applications/kitty.app</code>, and several tools live in <code>~/bin</code>. Homebrew will normally use different paths. The download contains two templates and a small preparation script that substitutes the paths returned by <code>command -v</code>. It writes only inside the extracted download, not into your live configuration:</p>
<pre><code>cd &quot;$HOME/Downloads/kitty-setup&quot;
python3 prepare.py
less kitty/kitty.conf
less yazi/yazi.toml</code></pre>
<p>The bundle’s <code>README.md</code> has the complete backup and copy commands. Back up first, then copy the three Kitty files together. Merge the shell snippet into your existing setup rather than replace your entire <code>.zshrc</code>; it may contain unrelated configuration. The resulting layout is:</p>
<pre><code>~/.config/kitty/
  kitty.conf
  theme.conf
  tab_bar.py
~/.config/terminal-setup/terminal.zsh
~/.config/yazi/
  yazi.toml
  plugins/piper.yazi/main.lua
  plugins/piper.yazi/LICENSE
~/Library/Preferences/glow/glow.yml</code></pre>
<p>Source the shell snippet once, near the end of <code>~/.zshrc</code>:</p>
<pre><code>source &quot;$HOME/.config/terminal-setup/terminal.zsh&quot;</code></pre>
<p>Ensure Homebrew is already on your shell’s <code>PATH</code>. My Apple Silicon login profile uses <code>eval "$(/opt/homebrew/bin/brew shellenv zsh)"</code>; Intel Macs usually have a different prefix. The guide assumes standard config locations, not a custom <code>ZDOTDIR</code> or <code>XDG_CONFIG_HOME</code>. Save work and open a fresh Kitty window after installing.</p>
<h2 id="appearance">3. The appearance: one palette, several renderers</h2><p>My font settings are small enough to keep together:</p>
<pre><code>font_family MesloLGS NF
bold_font auto
italic_font auto
bold_italic_font auto
font_size 14.0
text_composition_strategy 1.7 30
disable_ligatures never
macos_thicken_font 0.25</code></pre>
<p>The two composition numbers are gamma and contrast adjustments, not font weights. Allowing ligatures does not add ligatures to a font that lacks them. These are appearance preferences, not measured performance improvements.</p>
<p>The background is <code>#282c34</code>, text is <code>#abb2bf</code>, cyan is <code>#56b6c2</code>, blue is <code>#61afef</code>, green is <code>#98c379</code>, and red is <code>#e06c75</code>. The complete 16-colour palette is in <code>theme.conf</code>. Bat and delta use <code>TwoDark</code>; Glow uses its own dark rendering, so not every application shares identical colour tokens.</p>
<pre><code>window_padding_width 10
background_opacity 0.95
dynamic_background_opacity yes
background_blur 24
hide_window_decorations titlebar-only
initial_window_width 120c
initial_window_height 34c
remember_window_size yes</code></pre>
<p>The initial dimensions are character cells. Once Kitty remembers a window size, that saved size can take precedence. The 95% opacity and blur mean the desktop behind the window also affects its appearance.</p>
<pre><code>cursor_shape beam
cursor_blink_interval 0.5
cursor_trail 1
cursor_trail_decay 0.1 0.4
repaint_delay 8
input_delay 2
sync_to_monitor yes</code></pre>
<p><code>cursor_trail 1</code> is a millisecond threshold, not a one-pixel trail. The decay values control its fade timing. The repaint and input delays are batching controls; they are not measured end-to-end typing latency, and monitor synchronisation still limits rendering. Lower values can cost CPU. Blur is another possible cost. See <a href="https://sw.kovidgoyal.net/kitty/conf/">Kitty’s configuration reference</a> for the actual semantics.</p>
<h2 id="panes">4. Panes, tabs and the legend</h2><p>Kitty calls a pane a <em>window</em>; an OS window contains tabs, and each tab contains those panes. My enabled layouts are <code>splits,grid,stack,tall,fat</code>. I use native panes here, not tmux. They do not keep a remote job alive after a lost SSH connection.</p>
<pre><code>map cmd+d       launch --location=vsplit --cwd=current
map cmd+shift+d launch --location=hsplit --cwd=current
map cmd+g       goto_layout grid
map cmd+shift+g goto_layout splits</code></pre>
<div class="terminal-table"><table><thead><tr><th>Shortcut</th><th>Behaviour in my inspected configuration</th></tr></thead><tbody><tr><td>⌘D / ⇧⌘D</td><td>Side-by-side / stacked split, retaining the current working directory</td></tr><tr><td>⌘G / ⇧⌘G</td><td>Grid / manual splits layout</td></tr><tr><td>Ctrl+Shift+[ / ]</td><td>Previous / next pane</td></tr><tr><td>Ctrl+Shift+W</td><td>Close the focused pane</td></tr><tr><td>⌘W or Ctrl+Shift+Q</td><td>Close the tab, not just the focused pane</td></tr><tr><td>⌘T; ⇧⌘[ / ]</td><td>New tab; previous / next tab</td></tr><tr><td>Ctrl+Shift+L</td><td>Cycle enabled layouts, including stack</td></tr><tr><td>⌘F</td><td>Open scrollback search through the pager</td></tr><tr><td>Ctrl+Shift+Z / X</td><td>Previous / next prompt with shell integration</td></tr><tr><td>Ctrl+Shift+E</td><td>URL hints</td></tr><tr><td>Ctrl+Shift+F3</td><td>Command palette (Fn may be needed on a Mac keyboard)</td></tr></tbody></table></div>
<p>My <code>tab_bar.py</code> delegates tab drawing to Kitty’s powerline renderer, then appends a colour-coded legend after the last tab. Cyan means pane actions, gold means tabs, and red means closing. The bar is shown even with one tab.</p>
<p><strong>A correction to my old notes:</strong> the legend’s Option+Command+arrow reminder is not backed by a mapping in this snapshot. Shift+Command+Enter is not mapped to zoom either. Use the verified shortcuts above. The legend also skips itself when there is insufficient space; it is not literally always visible. Its simple character counting is not a perfect terminal-cell-width calculation.</p>
<p>If you want those extra bindings, add the following as an <em>optional change</em>. They are not part of my inspected configuration or the download:</p>
<pre><code>map opt+cmd+left  neighboring_window left
map opt+cmd+right neighboring_window right
map opt+cmd+up    neighboring_window up
map opt+cmd+down  neighboring_window down
map cmd+shift+enter toggle_layout stack</code></pre>
<h2 id="shell">5. The shell tools that make the theme useful</h2><p>The default macOS Zsh prompt is sufficient for this setup. The important changes are the commands behind it:</p>
<pre><code>alias md=&#x27;glow -p&#x27;
alias mdcat=&#x27;glow&#x27;
export GLAMOUR_STYLE=dark
alias cat=&#x27;bat&#x27;
export BAT_THEME=&quot;TwoDark&quot;
export MANPAGER=&quot;sh -c &#x27;col -bx | bat -l man -p&#x27;&quot;
export MANROFFOPT=&quot;-c&quot;
alias ls=&#x27;lsd --group-dirs first&#x27;
alias ll=&#x27;lsd -l --group-dirs first&#x27;
alias la=&#x27;lsd -la --group-dirs first&#x27;
alias lt=&#x27;lsd --tree --depth 2&#x27;
source &lt;(fzf --zsh)
eval &quot;$(zoxide init zsh)&quot;
alias ff=&#x27;fastfetch&#x27;</code></pre>
<p>Use <code>command cat</code> or <code>\\cat</code> when you need plain output instead of bat. These are interactive aliases; scripts should call the program they actually need. <code>md</code> opens Glow’s pager, while <code>mdcat</code> prints Markdown directly. <code>ff</code> is optional and does not run at every shell startup.</p>
<p><a href="https://github.com/junegunn/fzf#setting-up-shell-integration">fzf’s shell integration</a> supplies Ctrl+R for history, Ctrl+T for files and Alt+C for directory selection. The <code>--zsh</code> integration requires fzf 0.48 or newer. My left Option key acts as Alt. The full snippet also colours fzf to match the palette. <a href="https://github.com/ajeetdsouza/zoxide#installation">zoxide</a> learns directories as I visit them; a fresh installation will not know my navigation history.</p>
<h3>Yazi and rendered Markdown</h3><p>⌘B launches Yazi in a side-by-side split using <code>--bias=22</code>. This requests a relatively narrow pane; its exact width depends on the active layout and available space. It is a normal terminal pane, not a special file-browser widget.</p><p>The missing dependency in many “copy my theme” guides is the previewer. My Yazi configuration routes <code>.md</code>, <code>.markdown</code> and <code>.mdx</code> files through <a href="https://github.com/yazi-rs/plugins/tree/main/piper.yazi">Piper</a>, which invokes Glow:</p>
<pre><code>[[plugin.prepend_previewers]]
url = &quot;*.md&quot;
run = &#x27;piper -- CLICOLOR_FORCE=1 /absolute/path/to/glow -w=$w -s=dark &quot;$1&quot;&#x27;</code></pre>
<p><code>$w</code> is the preview width and <code>$1</code> is the selected path. MDX is treated as Markdown here; Glow is not running React components. An opener rule also makes opening these files run <code>glow -p</code>. The complete download contains all three rules, the opener, and my installed Piper code with its MIT licence. It does not fetch a moving plugin branch during setup.</p>
<p>Shift+Command+M uses Kitty path hints to open a selected on-screen path in a Glow overlay. It needs a real readable Markdown path; it is not an editor command. The preparation script resolves the executable path used by that mapping.</p>
<h3>Git diffs</h3><p>I configure delta separately from Zsh:</p>
<pre><code>git config --global core.pager delta
git config --global delta.navigate true
git config --global delta.line-numbers true
git config --global delta.syntax-theme TwoDark</code></pre>
<p>These change your global Git pager settings, so inspect existing values first. They enable navigation, line numbers and the TwoDark syntax theme. My inspected config does not enable side-by-side mode. The relevant upstream reference is <a href="https://dandavison.github.io/delta/configuration.html">delta’s configuration guide</a>.</p>
<h2 id="ssh">6. A colour cue for SSH</h2><p>My Zsh <code>ssh()</code> wrapper changes the background to <code>#1a1a2e</code>, text to <code>#f5f5f5</code>, and the cursor to <code>#ff5555</code> before calling the real SSH program. When it returns normally, the wrapper restores the three local colours and returns SSH’s exit status.</p>
<pre><code>ssh() {
  local local_bg=&quot;#282c34&quot; local_fg=&quot;#abb2bf&quot; local_cursor=&quot;#528bff&quot;
  local ssh_bg=&quot;#1a1a2e&quot;   ssh_fg=&quot;#f5f5f5&quot;   ssh_cursor=&quot;#ff5555&quot;

  printf &#x27;\\033]11;%s\\007&#x27; &quot;$ssh_bg&quot;
  printf &#x27;\\033]10;%s\\007&#x27; &quot;$ssh_fg&quot;
  printf &#x27;\\033]12;%s\\007&#x27; &quot;$ssh_cursor&quot;

  TERM=xterm-256color command ssh &quot;$@&quot;
  local ec=$?

  printf &#x27;\\033]11;%s\\007&#x27; &quot;$local_bg&quot;
  printf &#x27;\\033]10;%s\\007&#x27; &quot;$local_fg&quot;
  printf &#x27;\\033]12;%s\\007&#x27; &quot;$local_cursor&quot;

  return $ec
}</code></pre>
<p>OSC 10, 11 and 12 change text, background and cursor colours. <code>command ssh</code> prevents the wrapper calling itself. The <code>TERM=xterm-256color</code> fallback helps when a server lacks <code>xterm-kitty</code> terminfo, but it does not install remote aliases or force every remote program to use colour. <a href="https://sw.kovidgoyal.net/kitty/kittens/ssh/">Kitty’s SSH kitten</a> is another approach; it is not what this wrapper uses.</p>
<p>This cue is deliberately limited. It changes colour even if authentication fails, does not prove which host I reached, and resets to hard-coded local colours rather than a saved stack. Nested sessions or an interrupted shell can leave an unexpected colour. It is a reminder, not a safety check. The wrapper is included so you can reproduce it, not because these edge cases are solved.</p>
<h2 id="checks">7. Verify it before relying on it</h2><p>From a new Kitty shell, run:</p>
<pre><code>command -v bat glow lsd yazi fzf zoxide delta fastfetch
alias cat ls md
whence -w fzf-history-widget z
bat --list-themes
cd &quot;$HOME/Downloads/kitty-setup/examples&quot;
ll
cat hello.cpp
md README.md</code></pre>
<p>Then try ⌘D, Ctrl+Shift+W, ⌘B and a new tab. Test Ctrl+R with harmless commands rather than photograph real history. My font can be checked with Kitty’s <code>kitten choose-fonts</code>; verify the family and all four faces before changing anything.</p>
<div class="terminal-table"><table><thead><tr><th>Symptom</th><th>What to check</th></tr></thead><tbody><tr><td>Boxes instead of icons</td><td>MesloLGS NF is installed and the family name matches; reopen Kitty after font installation.</td></tr><tr><td>⌘B or Markdown hints fail</td><td>Run prepare.py after the tools are installed; inspect the resolved absolute paths.</td></tr><tr><td>Markdown preview is blank</td><td>Piper files are present, Glow is executable, and Yazi/Piper versions are compatible.</td></tr><tr><td>Ctrl+R does nothing</td><td>fzf --zsh was sourced once in the interactive shell; another plugin may override bindings.</td></tr><tr><td>Legend missing</td><td>The renderer omits it if the remaining tab-bar width is too small.</td></tr><tr><td>New shell has a plain prompt</td><td>Expected: this setup has no prompt framework.</td></tr><tr><td>Remote colours stay changed</td><td>The wrapper may not have returned normally; start a new shell/window or restore the three local colours.</td></tr><tr><td>Everything closed with ⌘W</td><td>That shortcut closes a tab; use Ctrl+Shift+W for one pane.</td></tr></tbody></table></div>
<h3>Two settings worth choosing deliberately</h3><p>The inspected configuration uses <code>confirm_os_window_close 0</code>, which disables close confirmation, and <code>allow_remote_control yes</code> with <code>listen_on unix:/tmp/mykitty</code>. Remote control allows programs to operate Kitty, including sending text and reading window content; with this broad setting, terminal programs reached over SSH can also be a concern. These are real choices in the snapshot, not requirements for the colour theme or shortcuts.</p>
<p>For a safer variant, change remote control to <code>no</code> and remove <code>listen_on</code>; set close confirmation to <code>-1</code> if you want Kitty to account for running commands. Review <a href="https://sw.kovidgoyal.net/kitty/remote-control/">Kitty’s remote-control permissions</a> before opting into the broad setting. Nothing in this guide changes my installed configuration automatically.</p>
<p>I keep 50,000 scrollback lines and a 100 MB pager-history allowance. Useful for build output, but scrollback can also contain sensitive command output. The download contains no history, SSH configuration, host addresses or credentials.</p>
<h2>What I checked, and what remains manual</h2><p>I checked the installed versions, read the files, parsed the configuration using the installed Kitty library, and compared effective shortcut mappings rather than trust the old README. I also checked the prepared bundle and the site build. That does not verify every interactive behaviour on a fresh Mac. Genuine terminal screenshots are not included in this version; the visual above is labelled as a diagram.</p>
<p>The most useful part of this setup is knowing which layer owns a behaviour. Kitty owns the panes. Zsh owns the aliases. Glow owns Markdown rendering. Once those boundaries are clear, the configuration becomes much easier to reproduce and debug.</p>
<h3>Official references and matching versions</h3><ul>
<li><a href="https://github.com/kovidgoyal/kitty/releases/tag/v0.48.2">Kitty 0.48.2</a> · <a href="https://sw.kovidgoyal.net/kitty/conf/">configuration</a> · <a href="https://sw.kovidgoyal.net/kitty/kittens/hints/">hints</a></li>
<li><a href="https://github.com/romkatv/powerlevel10k#fonts">MesloLGS NF font files</a></li>
<li><a href="https://github.com/sharkdp/bat/releases/tag/v0.26.1">bat 0.26.1</a> · <a href="https://github.com/charmbracelet/glow/releases/tag/v2.1.2">Glow 2.1.2</a> · <a href="https://github.com/lsd-rs/lsd/releases/tag/v1.2.0">lsd 1.2.0</a></li>
<li><a href="https://github.com/sxyazi/yazi/releases/tag/v26.5.6">Yazi 26.5.6</a> · <a href="https://github.com/yazi-rs/plugins/tree/9014ed2/piper.yazi">Piper snapshot</a></li>
<li><a href="https://github.com/junegunn/fzf/releases/tag/v0.74.2">fzf 0.74.2</a> · <a href="https://github.com/ajeetdsouza/zoxide/releases/tag/v0.10.0">zoxide 0.10.0</a></li>
<li><a href="https://github.com/dandavison/delta/releases/tag/0.19.2">delta 0.19.2</a> · <a href="https://github.com/fastfetch-cli/fastfetch/releases/tag/2.66.0">fastfetch 2.66.0</a></li>
</ul></div>`
};
