#!/bin/bash
prettier --write "4X\\4X.Max.js" 2>> FormatErrors.txt
prettier --write ".\/**\/*.css" 2>> FormatErrors.txt
prettier --write ".\/4X\/Modules\/*{.js,.json}" 2>> FormatErrors.txt
prettier --write ".\/Templates\/**\/*{.js,.json}" 2>> FormatErrors.txt
js-beautify -r --type="html" ".\/**\/*.{htm,html}" 2>> FormatErrors.txt
uglifyjs 4X\/4X.Max.js --comments --compress --mangle --output 4X\/4X.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/AccName.js --comments --compress --mangle --output 4X\/Min\/AccName.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Accordion.js --comments --compress --mangle --output 4X\/Min\/Accordion.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Animate.js --comments --compress --mangle --output 4X\/Min\/Animate.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Beep.js --comments --compress --mangle --output 4X\/Min\/Beep.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Button.js --comments --compress --mangle --output 4X\/Min\/Button.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Checkbox.js --comments --compress --mangle --output 4X\/Min\/Checkbox.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Combobox.js --comments --compress --mangle --output 4X\/Min\/Combobox.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/CurrentDevice.js --comments --compress --mangle --output 4X\/Min\/CurrentDevice.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/DatePicker.js --comments --compress --mangle --output 4X\/Min\/DatePicker.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Dialog.js --comments --compress --mangle --output 4X\/Min\/Dialog.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Dragula.js --comments --compress --mangle --output 4X\/Min\/Dragula.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Footnote.js --comments --compress --mangle --output 4X\/Min\/Footnote.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Listbox.js --comments --compress --mangle --output 4X\/Min\/Listbox.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Menu.js --comments --compress --mangle --output 4X\/Min\/Menu.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Popup.js --comments --compress --mangle --output 4X\/Min\/Popup.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Radio.js --comments --compress --mangle --output 4X\/Min\/Radio.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/RovingTabIndex.js --comments --compress --mangle --output 4X\/Min\/RovingTabIndex.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/SmoothScroll.js --comments --compress --mangle --output 4X\/Min\/SmoothScroll.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Straylight.js --comments --compress --mangle --output 4X\/Min\/Straylight.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Switch.js --comments --compress --mangle --output 4X\/Min\/Switch.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Tab.js --comments --compress --mangle --output 4X\/Min\/Tab.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Tooltip.js --comments --compress --mangle --output 4X\/Min\/Tooltip.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Tree.js --comments --compress --mangle --output 4X\/Min\/Tree.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/Velocity.js --comments --compress --mangle --output 4X\/Min\/Velocity.js 2>> FormatErrors.txt
uglifyjs 4X\/Modules\/VelocityUI.js --comments --compress --mangle --output 4X\/Min\/VelocityUI.js 2>> FormatErrors.txt