from kitty.fast_data_types import Screen
from kitty.tab_bar import (
    DrawData, ExtraData, TabBarData, as_rgb, draw_tab_with_powerline,
)

# Colour-coded by action type so the legend reads at a glance.
CYAN = as_rgb(0x56B6C2)  # pane actions (create / move)
GOLD = as_rgb(0xE5C07B)  # tab actions
RED  = as_rgb(0xE06C75)  # close / destroy
LAB  = as_rgb(0x828997)  # labels
SEP  = as_rgb(0x4B5263)  # separators

LEGEND = (
    (CYAN, "⌘↩"), (LAB, " new "),
    (SEP, "│ "),
    (RED, "⌘W"), (LAB, " close "),
    (SEP, "│ "),
    (CYAN, "⌥⌘→"), (LAB, " move "),
    (SEP, "│ "),
    (GOLD, "⌘T"), (LAB, " +tab "),
    (SEP, "│ "),
    (RED, "⌃⇧Q"), (LAB, " ✕tab "),
    (SEP, "│ "),
    (GOLD, "⇧⌘[ ]"), (LAB, " tabs"),
)

def _draw_legend(screen: Screen) -> None:
    width = sum(len(text) for _, text in LEGEND)
    spaces = screen.columns - screen.cursor.x - width - 1
    if spaces < 1:
        return
    screen.draw(" " * spaces)
    for color, text in LEGEND:
        screen.cursor.fg = color
        screen.draw(text)
    screen.cursor.fg = 0
    screen.cursor.bg = 0

def draw_tab(draw_data: DrawData, screen: Screen, tab: TabBarData,
             before: int, max_title_length: int, index: int,
             is_last: bool, extra_data: ExtraData) -> int:
    draw_tab_with_powerline(draw_data, screen, tab, before, max_title_length, index, is_last, extra_data)
    if is_last:
        _draw_legend(screen)
    return screen.cursor.x
