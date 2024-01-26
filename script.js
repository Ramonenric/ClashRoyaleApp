document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const fightBtn = document.getElementById('fightBtn');
  const resetBtn = document.getElementById('resetBtn');
  const template = document.getElementById('template');
  const result = document.getElementById('result');
  const infoFight = document.getElementById('infoFight');

  let characters = [];
  let selectedCard = [];

  fightBtn.style.display = 'none';
  resetBtn.style.display = 'none';

  fightBtn.addEventListener('click', fight);
  resetBtn.addEventListener('click', resetGame);

  startBtn.addEventListener('click', async () => {
    const response = await fetch('personajes.json');
    characters = await response.json();  
    result.innerHTML = '';

    const charactersToDistribute = [...characters];

    for (let jugador = 1; jugador <= 2; jugador++) {
        const containerPlayerCards = document.getElementById(`cards-player${jugador}`);

        for (let i = 0; i < 5; i++) {
            if (charactersToDistribute.length > 0) {
                const randomIndex = Math.floor(Math.random() * charactersToDistribute.length);
                const character = charactersToDistribute.splice(randomIndex, 1)[0];

                const card = template.content.cloneNode(true);
                const cardElement = card.querySelector('.card');
                cardElement.querySelector('#name').textContent = character.nom;
                cardElement.querySelector('img').src = character.foto;
                card.querySelector('#stats').innerHTML = `Attack: ${character.atac} <br> Defense: ${character.defensa} <br> Speed: ${character.velocitat} <br> Health: ${character.salut}`;

                containerPlayerCards.appendChild(card);
                cardElement.addEventListener('click', () => selectCard(cardElement, character));

            }
        }
    }
    result.classList.remove('hidden');

    document.getElementById('player1').style.display = 'flex';
    document.getElementById('player2').style.display = 'flex';


    fightBtn.style.display = 'block';
    resetBtn.style.display = 'block';

    startBtn.style.display = 'none';
  });

  function selectCard(cartaSeleccionada, character) {
      if (selectedCard.length < 2) {
          selectedCard.push(character);

          cartaSeleccionada.classList.add('selected');

          console.log("Personaje seleccionado:", character.nom);

          if (selectedCard.length === 2) {
              fightBtn.disabled = false;
          }
      }
  }

  function fight() {
    infoFight.innerHTML = '';
    if (selectedCard.length === 2) {
        const firstCard = selectedCard[0];
        const secondCard = selectedCard[1];

        const firstCardSpeed = firstCard.velocitat;
        const secondCardSpeed = secondCard.velocitat;

        let attacker, defender;
        if (firstCardSpeed > secondCardSpeed) {
            attacker = firstCard;
            defender = secondCard;
        } else {
            attacker = secondCard;
            defender = firstCard;
        }

        let attackerHP = attacker.salut;
        let defenderHP = defender.salut;

        result.innerHTML = `${attacker.nom} vs ${defender.nom}<br>`;

        while (attackerHP > 0 && defenderHP > 0) {
            const attack = attacker.atac;
            const defense = defender.defense;

            if (attack > defense) {
                const damage = attack - defense;
                defenderHP -= damage;
                infoFight.innerHTML += `${attacker.nom} does ${damage} of damage to ${defender.nom}. ${defender.nom} now has ${defenderHP} of health.<br>`;
            } else {
                defenderHP -= 10;
                infoFight.innerHTML += `${attacker.nom} does 10 of damage to ${defender.nom}. ${defender.nom} now has ${defenderHP} of health.<br>`;
            }

            [attacker, defender] = [defender, attacker];
            [attackerHP, defenderHP] = [defenderHP, attackerHP];
        }

        if (attackerHP <= 0) {
            hideWeakedCard(attacker);
            result.innerHTML += `${defender.nom} win.<br> ${attacker.nom} has been defeated.`;

            const winner = defender;
            winner.salut = defenderHP;
        } else if (defenderHP <= 0) {
            hideWeakedCard(defender);
            result.innerHTML += `${attacker.nom} win.<br> ${defender.nom} has been defeated.`;

            const winner = attacker;
            winner.salut = attackerHP;
        }

        infoFight.classList.remove("hidden");
        infoFight.classList.add("visible");

        result.classList.remove("hidden");
        result.classList.add("visible");

        selectedCard.forEach(carta => {
            const selectedCard = document.querySelector('.selected');
            if (selectedCard) {
                selectedCard.classList.remove('selected');
            }
        });

        selectedCard = [];
        fightBtn.disabled = true;

        resetHealth();
    }
}


  function hideWeakedCard(carta) {
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
          if (card.querySelector('#name').textContent === carta.nom) {
              card.style.display = 'none';
          }
      });
  }

  function resetHealth() {
      characters.forEach(character => {
          const cards = document.querySelectorAll('.card');
          cards.forEach(card => {
              if (card.querySelector('#name').textContent === character.nom) {
                  card.querySelector('#stats').innerHTML = `Attack: ${character.atac} <br> Defense: ${character.defensa} <br> Speed: ${character.velocitat} <br> Health: ${character.salut}`;
              }
          });
      });
  }

  function resetGame() {
      location.reload();
  }


});
