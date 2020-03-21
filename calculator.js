eau = $('#eau')
farine = $('#farine')
th = $('#th')
ts = $('#ts')
tl = $('#tl')
sel = $('#sel')
levure = $('#levure')

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
    eau.val(
        (read(th) * read(farine) / 100).toFixed(0)
    )
    sel.val(
        (read(ts) * read(farine) / 100).toFixed(0)
    )
    levure.val(
        (read(tl) * read(farine) / 100).toFixed(0)
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

farine.on("input", update);
th.on("input", update);
ts.on("input", update);
tl.on("input", update);

update()
