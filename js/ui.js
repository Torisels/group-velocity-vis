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
            fillInputs(k1, k2, f1, f2);

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

    handleModeChange(document.getElementById("btn-mode").checked);

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
    document.getElementById("btn-mode").onchange = function () {
        console.log(this.checked);
        handleModeChange(this.checked);
    };

    //
    // $(".params-input").oninput = function(){
    //     this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
    // };

    document.querySelectorAll('.params-input').forEach(function (input) {
        input.oninput = function () {
            this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
            const v = parseFloat(this.value);
            setVariable(this.id, v)
        };
    });

    function setVariable(elementId, value) {
        if (!isNaN(value)) {
            switch (elementId) {
                case "inp-k1":
                    k1 = value;
                    clearAndCalculate();
                    break;
                case "inp-k2":
                    k2 = value;
                    clearAndCalculate();
                    break;

                case "inp-f1":
                    f1 = value;
                    clearAndCalculate();
                    break;
                case "inp-f2":
                    f2 = value;
                    clearAndCalculate();
                    break;
                default:
                    break;
            }
        }
    }
}


function saveColorsToLS(colorObj) {
    localStorage.setItem('colorsSetting', JSON.stringify(colorObj));
}

function fillInputs(k1, k2, f1, f2) {
    document.getElementById("inp-k1").value = k1;
    document.getElementById("inp-k2").value = k2;
    document.getElementById("inp-f1").value = Math.round((f1 + Number.EPSILON) * 100) / 100;
    document.getElementById("inp-f2").value = Math.round((f2 + Number.EPSILON) * 100) / 100;

}


function handleModeChange(newMode) {
    if (newMode === true) {
        isAutomatic = true;
        document.querySelectorAll('.params-input').forEach(function (input) {
            input.readOnly = true;
        });
        $(".preset-clicker").removeAttr('disabled');

        if (lastPreset) {
            document.getElementById("btn-" + lastPreset).click();

        } else {
            document.getElementById("btn-below0").click();
        }
        $("#manual-box").addClass("d-none");
        $("#automatic-box").removeClass("d-none");
    } else {
        isAutomatic = false;
        lastPreset = currentPreset;
        currentPreset = "";
        $(".preset-clicker").attr('disabled', 'disabled');
        document.querySelectorAll('.params-input').forEach(function (input) {
            input.readOnly = false;
        });
        $("#manual-box").removeClass("d-none");
        $("#automatic-box").addClass("d-none");
    }
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

