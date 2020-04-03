var eau = $('#eau')
var farine = $('#farine')
var th = $('#th')
var ts = $('#ts')
var tl = $('#tl')
var sel = $('#sel')
var levure = $('#levure')
var notes = $("#notes")

var saved_items = {
    "farine": farine,
    "th": th,
    "ts": ts,
    "tl": tl,
    "notes": notes
}

for (var key in saved_items) {
    var stored = window.localStorage.getItem(key)
    if (stored !== null) {
        saved_items[key].val(stored)
    }
}

poolish_eau = $('#poolish_eau')
poolish_farine = $('#poolish_farine')
poolish_levure = $('#poolish_levure')

reste_eau = $('#reste_eau')
reste_farine = $('#reste_farine')
reste_levure = $('#reste_levure')
reste_sel = $('#reste_sel')

function read(input) {
    return parseFloat(input.val())
}


function update() {

    for (var key in saved_items) {
        window.localStorage.setItem(key, saved_items[key].val())
    }

    eau.val(
        (read(th) * read(farine) / 100).toFixed(0)
    )
    sel.val(
        (read(ts) * read(farine) / 100).toFixed(1)
    )
    levure.val(
        (read(tl) * read(farine) / 100).toFixed(1)
    )

    poolish_farine.val(
        (read(farine) / 3).toFixed(0)
    )
    poolish_eau.val(read(poolish_farine))
    poolish_levure.val(
        (read(poolish_farine) * 0.003).toFixed(1)
    )

    reste_farine.val(read(farine) - read(poolish_farine))
    reste_eau.val(read(eau) - read(poolish_eau))
    reste_levure.val(read(levure) - read(poolish_levure))
    reste_sel.val(read(sel))
}


function reset(_farine, _th, _ts, _tl) {
    farine.val(_farine)
    th.val(_th)
    ts.val(_ts)
    tl.val(_tl)
    notes.val("")
    update()
}

for (var key in saved_items) {
    saved_items[key].on("input", update)
}

update()
