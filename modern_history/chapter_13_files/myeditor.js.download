function insertTab() {
            if (!window.getSelection) return;
            const sel = window.getSelection();
            if (!sel.rangeCount) return;
            const range = sel.getRangeAt(0);
            range.collapse(true);
            const span = document.createElement('span');
            span.appendChild(document.createTextNode('\t'));
            span.style.whiteSpace = 'pre';
            range.insertNode(span);
            // Move the caret immediately after the inserted span
            range.setStartAfter(span);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }

        $(document).on('keydown', '.editor', function (e) {
            if (e.keyCode == 9) {
                insertTab();
                e.preventDefault()
            }
        });