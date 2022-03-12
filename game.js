class GameApp {

  constructor(isSecond = false) {
    this.cards = [
      {
        class: 'one',
        image: 'one',
        completed: false
      },
      {
        class: 'two',
        image: 'two',
        completed: false
      },
      {
        class: 'three',
        image: 'three',
        completed: false
      }
    ]
    this.isSecond = isSecond
  }

  setup() {
    this.setupCards()
    this.clickAnimation()
  }


  setupCards()
  {
      let arr = this.getRandom([...this.cards, ...this.cards]);
      let rand = (Math.random() <= 0.5) ? 0 : 1;
      let degRot = [180, 0];
      let self = this;
      arr.forEach((card, cardInd) => {
        let path = self.isSecond ? `img/second/${card.class}.png` : `img/${card.class}.png`
        let elNode = this.htmlToElements(`
        <div class="scene scene--card">
          <div class="select-image card" data-num="${card.class}">
            <div class="card__face card__face--front">${cardInd + 1}</div>
            <div class="card__face card__face--back" >
              <img src="${path}" style="transform: rotate(${degRot[rand]}deg) scale(1.25)">
            </div>
          </div>
        </div>
        `)
        document.getElementById('game').append(elNode)
      })
  }


  resetCard() {
    let els =document.querySelectorAll('.is-flipped:not(.done)');
    Array.from(els).forEach(el => {
      el.classList.toggle('is-flipped')
    })
  }

  resetAllCards() {
    let els =document.querySelectorAll('.is-flipped');
    Array.from(els).forEach(el => {
      el.classList.toggle('is-flipped')
      el.classList.toggle('done')
    })
  }

  clickAnimation()
  {
    let self = this
    let cards = document.querySelectorAll('.select-image');
    let match = [];

    [...cards].forEach((card)=>{
      card.addEventListener( 'click', function(e) {
        e.preventDefault()
        e.stopImmediatePropagation()

        let classes = Object.assign([], this.classList)
        //has done return
        if([...cards].length === document.querySelectorAll('.done').length) {
          Swal.fire({
            title: 'Do you want to play again?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire('Game!', '', 'success')
                .then(() => {
                  self.resetAllCards()
                })
            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
          })
        }

        if(classes.includes('done'))  {
          return false
        }
        match.push(this.dataset.num)


        if(match[0] === match[1]) {
          //add class done
          Swal.fire(
            'Good job!',
            'You clicked the button!',
            'success'
          )
          let datasets = document.querySelectorAll(`[data-num="${this.dataset.num}"]`)
          Array.from(datasets).forEach(el => {
            el.classList.add('done')
          })
          //reset match
          match = []
        }
        let hasFlipped = document.querySelectorAll('.is-flipped:not(.done)')
        // toggle
        if(hasFlipped.length  == 2) {
          self.resetCard()
          match = []
        } else {
          this.classList.toggle('is-flipped')
        }

      });
    });
  }

  htmlToElements(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  }

  getRandom (list) {
    return list.map((a) => ({sort: Math.random(), value: a}))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
  }

}


