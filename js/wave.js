class Wave {
    constructor(A, k, freq, phase) {
        this.A = A;
        this.k = k;
        this.omega = freq;
        this.phase = phase;
    }

    getY(x, t) {
        return this.A * Math.cos(this.k * x - this.omega * t + this.phase)
    }


}