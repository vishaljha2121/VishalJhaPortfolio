export PATH="$HOME/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"

# kitty + markdown (glow)
alias md='glow -p'
alias mdcat='glow'
export GLAMOUR_STYLE=dark

# bat: syntax-colored cat + man pages (Atom One Dark via TwoDark). \cat = plain cat.
alias cat='bat'
export BAT_THEME="TwoDark"
export MANPAGER="sh -c 'col -bx | bat -l man -p'"
export MANROFFOPT="-c"

# vibrant dev toolkit
alias ls='lsd --group-dirs first'
alias ll='lsd -l --group-dirs first'
alias la='lsd -la --group-dirs first'
alias lt='lsd --tree --depth 2'
source <(fzf --zsh)          # ⌃R history · ⌃T files · ⌥C cd  (needs fzf >= 0.48)
export FZF_DEFAULT_OPTS="--height 40% --layout=reverse --border --color=fg:#abb2bf,hl:#61afef,fg+:#ffffff,bg+:#3e4451,hl+:#61afef,info:#98c379,prompt:#c678dd,pointer:#e06c75,marker:#e5c07b,spinner:#56b6c2,header:#5c6370"
eval "$(zoxide init zsh)"     # smart cd:  z <dir>

# fastfetch banner (no Powerlevel10k in this setup, so just call `ff` when wanted)
alias ff='fastfetch'

# Visual SSH cue; TERM compatibility does not install remote colors or tools.
# This restores fixed local colors after a normal return, not a prior color stack.
ssh() {
  local local_bg="#282c34" local_fg="#abb2bf" local_cursor="#528bff"
  local ssh_bg="#1a1a2e"   ssh_fg="#f5f5f5"   ssh_cursor="#ff5555"

  printf '\033]11;%s\007' "$ssh_bg"
  printf '\033]10;%s\007' "$ssh_fg"
  printf '\033]12;%s\007' "$ssh_cursor"

  TERM=xterm-256color command ssh "$@"
  local ec=$?

  printf '\033]11;%s\007' "$local_bg"
  printf '\033]10;%s\007' "$local_fg"
  printf '\033]12;%s\007' "$local_cursor"

  return $ec
}
