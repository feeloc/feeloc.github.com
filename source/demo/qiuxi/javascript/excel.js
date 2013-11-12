// Enable user to move focus in a grid of inputs with Ctrl + Up, Down, Left, Right, Home, End
// Could be called again after more rows are created.
// deerchao@gmail.com   2009-2-23

// usage:
//--------------Html----------------
//  <tr class="dataRow">
//      <td><input /></td>
//      <td><input /></td>
//      <td><input /></td>
//  </tr>
//  <tr class="dataRow">
//      <td><input /></td>
//      <td><input /></td>
//      <td><input /></td>
//  </tr>
//--------------Script-------------
// jQuery.excel('dataRow');

jQuery.extend({
    excel: function(rowClass) {
        var keys = { left: 37, up: 38, right: 39, down: 40, home: 36, end: 35 };
        rowClass = rowClass ? rowClass : '.excel';
        if (rowClass[0] != '.')
            rowClass = '.' + rowClass;

        $(rowClass).unbind('keyup',onkeyup).bind('keyup',onkeyup);

        function onkeyup(evt) {
            var ctrlOnly = evt.ctrlKey && !evt.altKey && !evt.shiftKey;
            switch (evt.keyCode) {
                case keys.down:
                    go("down");
                    break;
                case keys.up:
                    go("up");
                    break;
                case keys.left:
                    if (ctrlOnly)
                        go("left");
                    break;
                case keys.right:
                    if (ctrlOnly)
                        go("right");
                    break;
                case keys.home:
                    if (ctrlOnly)
                        go("home");
                    break;
                case keys.end:
                    if (ctrlOnly)
                        go("end");
                    break;
            }

            function go(to) {
                var td = $(evt.target).closest('td');
                var tr = $(evt.currentTarget);
                var toFocus = null;
                switch (to) {
                    case 'home':
                        toFocus = lastInput(td.prevAll('td'));
                        break;
                    case 'end':
                        toFocus = lastInput(td.nextAll('td'));
                        break;
                    case 'left':
                        toFocus = firstInput(td.prevAll('td'));
                        if (!toFocus)
                            toFocus = lastInput(tr.prev('tr' + rowClass).children('td'));
                        break;
                    case 'right':
                        toFocus = firstInput(td.nextAll('td'));
                        if (!toFocus)
                            toFocus = firstInput(tr.next('tr' + rowClass).children('td'));
                        break;
                    case 'up':
                        toFocus = firstInput(tr.prev('tr' + rowClass).children('td'), td.prevAll('td').size());
                        break;
                    case 'down':
                        toFocus = firstInput(tr.next('tr' + rowClass).children('td'), td.prevAll('td').size());
                        break;
                }
                if (toFocus) {
                    toFocus.focus();
                }
            }

            function firstInput(tds, start) {
                if (!start)
                    start = 0;
                for (var i = start; i < tds.size(); i++) {
                    var inputs = $(tds[i]).children('input, select, textarea');
                    if (inputs.size())
                        return inputs[0];
                }
                return null;
            }

            function lastInput(tds) {
                for (var i = tds.size() - 1; i >= 0; i--) {
                    var inputs = $(tds[i]).children('input, select, textarea');
                    if (inputs.size())
                        return inputs[0];
                }
                return null;
            }
        }
    }
});