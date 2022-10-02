function digitBy2(char: string): number {
    switch(char) {
        case "0":
        case "1":
            return 0;
        case "2":
        case "3":
            return 1;
        case "4":
        case "5":
            return 2;
        case "6":
        case "7":
            return 3;
        case "8":
        case "9":
            return 4;
    }
}

export function divideBy2(num: string): string {
    if (num === "0") {
        return "0";
    }
    const dotIndex = num.lastIndexOf(".");
    const lastIsOdd = +num.charAt(num.length - 1) % 2;
    if (dotIndex >= 0) {
        num = num.replace(".", "");
        num += (lastIsOdd ? "0" : "");
    }
    num = "0" + num;
    let res = "";
    for (let i = 0; i < num.length - 1; i++) {
        const a = (+num.charAt(i)) % 2 ? 5 : 0;
        const b = digitBy2(num.charAt(i + 1));
        res += (a + b);
    }
    if (dotIndex < 0 && lastIsOdd) {
        res += ".5";
    }
    if (dotIndex >= 0) {
        res = `${res.slice(0, dotIndex)}.${res.slice(dotIndex)}`;
    }
    if (res.charAt(0) === "0" && res.charAt(1) !== ".") {
        res = res.slice(1);
    }
    return res;
}

function sumEqual(a: string, b: string, carry = false): [string, boolean] {
    let res = "";
    for (let i = a.length - 1; i >= 0;i--) {
        const temp = `${+a.charAt(i) + +b.charAt(i) + (carry ? 1 : 0)}`;
        carry = temp.length > 1;
        res = (temp.charAt(temp.length - 1)) + res;
    }
    return [res, carry];
}

function getSides(a: [string, string], b: [string, string], after = true): [string, string] {
    const idx = after ? 1 : 0;
    const larger = a[idx].length > b[idx].length ? a[idx] : b[idx];
    const smaller = a[idx].length <= b[idx].length ? a[idx] : b[idx];
    const zeros = [...Array(larger.length - smaller.length).keys()].map(() => 0).join("");
    return [larger, after ? (smaller + zeros) : (zeros + smaller)];
}

export function sum(x: string, y: string): string {
    x += (x.includes(".") ? "" : ".0");
    y += (y.includes(".") ? "" : ".0");
    const a = x.split(".").concat("").slice(0, 2) as [string, string];
    const b = y.split(".").concat("").slice(0, 2) as [string, string];

    const [a1, a2] = getSides(a, b);
    const [aRes, carry] = sumEqual(a1, a2);

    const [b1, b2] = getSides(a, b, false);
    const [bRes, carry2] = sumEqual(b1, b2, carry);
    const res = (carry2 ? "1" : "") + bRes + "." + aRes;
    return res.endsWith(".0") ? res.slice(0, res.length - 2) : res;
}