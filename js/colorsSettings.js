class ColorsSettings {
    set firstWave(value) {
        this._firstWave = value;
    }

    set secondWave(value) {
        this._secondWave = value;
    }

    set sumWave(value) {
        this._sumWave = value;
    }

    set envelope(value) {
        this._envelope = value;
    }

    set dot(value) {
        this._dot = value;
    }

    get firstWave() {
        return toRgb(this._firstWave);
    }

    get secondWave() {
        return toRgb(this._secondWave);
    }

    get sumWave() {
        return toRgb(this._sumWave);
    }

    get envelope() {
        return toRgb(this._envelope);
    }

    get dot() {
        return toRgb(this._dot);
    }

    constructor(firstWave, secondWave, sumWave, envelope, dot) {
        this._firstWave = firstWave;
        this._secondWave = secondWave;
        this._sumWave = sumWave;
        this._envelope = envelope;
        this._dot = dot;
    }

}


function toRgb(values) {
    if (values.length === 4) {
        values.pop();
    }
    return 'rgb(' + values.join(', ') + ')';
}