function init() {
    for (let btnPreset of document.getElementsByClassName("preset-clicker")) {
        btnPreset.onclick = function () {
            for (let element of document.getElementsByClassName("preset-clicker")) {
                element.classList.remove("active");
            }
            this.classList.add("active");
            choosePreset(this.id.replace('btn-', ''));
        }
    }
}