#!/bin/bash
export WINEPREFIX=~/.local/share/wineprefixes/32bitTest;
wine start.exe compile_core.bat
export WINEPREFIX=~/.wine;
