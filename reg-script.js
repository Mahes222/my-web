let mail;

function fun1() {
    mail = document.getElementById("mail1").value;
    document.getElementById("word").textContent = mail;
}

function mymailid() {
    return mail;
}

// Attach fun1 to window only in the browser
if (typeof window !== "undefined") {
    window.fun1 = fun1;
}

module.exports = { mymailid };
