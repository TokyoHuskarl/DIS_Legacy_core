# -*- coding: utf-8 -*-
# filename
file_a = "TPC_verjet.txt"
file_b = "TPC_readme_en.txt"

# loadfile
with open(file_a, "r") as f_a, open(file_b, "r") as f_b:
    lines_a = f_a.readlines()
    lines_b = f_b.readlines()

# get
lines_a_to_replace = [line for line in lines_a if '◆' in line]
lines_b_to_replace = [line for line in lines_b if '◆' in line]

# replace
for i, line in enumerate(lines_b_to_replace):
    lines_b[lines_b.index(line)] = lines_a_to_replace[i]

# write file
with open("output.txt", "w") as f_b:
    f_b.writelines(lines_b)
