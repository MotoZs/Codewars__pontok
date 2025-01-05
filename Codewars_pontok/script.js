const felhasznaloForm = document.getElementById("felhasznalo-form");
const felhasznalonevInput = document.getElementById("felhasznalonev");
const kartyaTarolo = document.getElementById("kartya-tarolo");
const temaValtas = document.getElementById("tema-valtas");
const adatokTorleseGomb = document.getElementById("adatok-torlese");

document.addEventListener("DOMContentLoaded", () => {
  const mentettTema = localStorage.getItem("tema") || "light-mode";
  document.body.className = mentettTema;

  const mentettFelhasznalok = JSON.parse(localStorage.getItem("felhasznalok")) || [];
  mentettFelhasznalok.forEach(felhasznaloAdatLekeres);
});

felhasznaloForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const felhasznalonev = felhasznalonevInput.value.trim();
  if (felhasznalonev) {
    felhasznaloAdatLekeres(felhasznalonev);
    felhasznaloMentese(felhasznalonev);
    felhasznalonevInput.value = "";
  }
});

async function felhasznaloAdatLekeres(felhasznalonev) {
  try {
    const valasz = await fetch(`https://www.codewars.com/api/v1/users/${felhasznalonev}`);
    if (!valasz.ok) {
      throw new Error("Felhasználó nem található.");
    }
    const adat = await valasz.json();
    felhasznaloKartyaMegjelenites(adat);
  } catch (hiba) {
    alert(hiba.message);
  }
}

function felhasznaloKartyaMegjelenites(felhasznalo) {
  const kartya = document.createElement("div");
  kartya.classList.add("card");

  kartya.innerHTML = `
    <h2>${felhasznalo.username}</h2>
    <p><strong>Name:</strong> ${felhasznalo.name || "Nincs megadva"}</p>
    <p><strong>Clan:</strong> ${felhasznalo.clan || "Nincs megadva"}</p>
    <p><strong>languages:</strong> ${Object.keys(felhasznalo.ranks.languages).join(", ")}</p>
    <p><strong>Points:</strong> ${felhasznalo.honor}</p>
    <p><strong>Rank:</strong> ${
      felhasznalo.ranks.languages.javascript
        ? felhasznalo.ranks.languages.javascript.name
        : "Nincs adat"
    }</p>
  `;

  kartyaTarolo.appendChild(kartya);
}

function felhasznaloMentese(felhasznalonev) {
  const mentettFelhasznalok = JSON.parse(localStorage.getItem("felhasznalok")) || [];
  if (!mentettFelhasznalok.includes(felhasznalonev)) {
    mentettFelhasznalok.push(felhasznalonev);
    localStorage.setItem("felhasznalok", JSON.stringify(mentettFelhasznalok));
  }
}

adatokTorleseGomb.addEventListener("click", () => {
  localStorage.removeItem("felhasznalok");
  kartyaTarolo.innerHTML = "";
});

temaValtas.addEventListener("click", () => {
  const aktualisTema = document.body.className;
  const ujTema = aktualisTema === "light-mode" ? "dark-mode" : "light-mode";
  document.body.className = ujTema;
  localStorage.setItem("tema", ujTema);
});
