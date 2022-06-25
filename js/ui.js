function init() {
    // colors
    const loaded = getColorsFromLS();

    if (loaded == null) {
        const firstColor = [233, 30, 99];
        const secondColor = [0, 0, 255];
        const sumColor = [76, 175, 80];
        const dotColor = [255, 0, 0];
        const envelopeColor = [205, 133, 63];

        colors = new ColorsSettings(firstColor, secondColor, sumColor, envelopeColor, dotColor);
    } else {
        colors = getColorsFromLS();
        console.log(colors);
    }

    function getColorsFromLS() {
        const c = JSON.parse(localStorage.getItem('colorsSetting'));
        if (c == null)
            return null;
        console.log(c)
        return new ColorsSettings(c._firstWave, c._secondWave, c._sumWave, c._envelope, c._dot);
    }

    for (let btnPreset of document.getElementsByClassName("preset-clicker")) {
        btnPreset.onclick = function () {
            for (let element of document.getElementsByClassName("preset-clicker")) {
                element.classList.remove("active");
            }
            this.classList.add("active");
            choosePreset(this.id.replace('btn-', ''));
        }
    }


    document.getElementById("speedRange").oninput = function () {
        speedMultiplier = this.value;
        dt = speedMultiplier * dt_c;
        document.getElementById("speedSpan").innerText = this.value;
    };

    document.getElementById("resolutionRange").oninput = function () {
        resolution = this.value;
        console.log(resolution)
        document.getElementById("resolutionspan").innerText = this.value;
        resolutionMaxRatio = xMax / resolution;

        first = Array(resolution + 1);
        second = Array(resolution + 1);
        sum = Array(resolution + 1);
        lowerEnvelope = Array(resolution + 1);
        upperEnvelope = Array(resolution + 1);

    };
    document.getElementById("resetSpeed").onclick = function () {
        dt = dt_c;
        document.getElementById("speedSpan").innerText = 1;
        document.getElementById("speedRange").value = 1;

    }

    const pickr1 = createPicker("#firstWavePicker", colors.firstWave);
    const pickr2 = createPicker("#secondWavePicker", colors.secondWave);
    const pickrSum = createPicker("#sumWavePicker", colors.sumWave);
    const pickrDot = createPicker("#dotPicker", colors.dot);
    const pickrEnvelope = createPicker("#envelopePicker", colors.envelope);
    pickr1.on('save', (color, instance) => {
        instance.hide();
        colors.firstWave = color.toRGBA()
        console.log(color.toRGBA())
        saveColorsToLS(colors);
    });
    pickr2.on('save', (color, instance) => {
        instance.hide();
        colors.secondWave = color.toRGBA();
        saveColorsToLS(colors);

    });
    pickrSum.on('save', (color, instance) => {
        instance.hide();
        colors.sumWave = color.toRGBA();
        saveColorsToLS(colors);

    });
    pickrDot.on('save', (color, instance) => {
        instance.hide();
        const c = color.toRGBA();
        colors.dot = c;
        saveColorsToLS(colors);
    });
    pickrEnvelope.on('save', (color, instance) => {
        instance.hide();
        colors.envelope = color.toRGBA();
        saveColorsToLS(colors);
    });

    document.getElementById("resetColors").onclick = function () {

        const firstColor = [233, 30, 99];
        const secondColor = [0, 0, 255];
        const sumColor = [76, 175, 80];
        const dotColor = [255, 0, 0];
        const envelopeColor = [205, 133, 63];

        colors = new ColorsSettings(firstColor, secondColor, sumColor, envelopeColor, dotColor);
        pickr1.setColor(colors.firstWave);
        pickr2.setColor(colors.secondWave);
        pickrSum.setColor(colors.sumWave);
        pickrDot.setColor(colors.dot);
        pickrEnvelope.setColor(colors.envelope);
        saveColorsToLS(colors);

    }
}

function saveColorsToLS(colorObj) {
    localStorage.setItem('colorsSetting', JSON.stringify(colorObj));
}


function createPicker(element, initialColor) {
    return Pickr.create({
        el: element,
        theme: 'monolith', // or 'monolith', or 'nano'
        swatches: [
            'rgb(255, 0, 0)',
            'rgb(233, 30, 99)',
            'rgb(156, 39, 176)',
            'rgb(103, 58, 183)',
            'rgb(63, 81, 181)',
            'rgb(33, 150, 243)',
            'rgb(3, 169, 244)',
            'rgb(0, 188, 212)',
            'rgb(0, 150, 136)',
            'rgb(76, 175, 80)',
            'rgb(139, 195, 74)',
            'rgb(205, 220, 57)',
            'rgb(255, 235, 59)',
            'rgb(255, 193, 7)'
        ],
        default: initialColor,
        components: {
            // Main components
            preview: true,
            opacity: false,
            hue: true,

            // Input / output Options
            interaction: {
                hex: true,
                input: true,
                save: true
            }
        }
    });
}

