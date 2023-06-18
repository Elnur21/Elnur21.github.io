import React from 'react'
import './portfolio.css'
import TICTACTOE from '../../assets/tictactoe.png'
import GAME from '../../assets/game.png'
import PINGPONG from '../../assets/pingpong.png'
import GAMEFifteen from '../../assets/Screenshot (1).png'
import YUMMY from '../../assets/Screenshot (2).png'
import MELADORA from '../../assets/Screenshot (3).png'
import SMART from '../../assets/Screenshot (4).png'
import COZA from '../../assets/Screenshot (5).png'
import SHOP from '../../assets/Screenshot (6).png'
import LUCKY from '../../assets/Screenshot (7).png'
import TIMEZONE from '../../assets/Screenshot (8).png'
import BAND from '../../assets/Screenshot (9).png'
import RF from '../../assets/Screenshot (10).png'


const data = [
  {
    id: 1,
    image: TICTACTOE,
    title: "Tic Tac Toe Game",
    github: "https://github.com/Elnur21/tik-tak-toe-Tkinter-and-React",
    demo: "https://github.com/Elnur21/tik-tak-toe-Tkinter-and-React",
    btn1:"GitHub",
    btn2:"No Demo"
  },
  {
    id: 2,
    image: GAME,
    title: "Brick breaker hit game",
    github: "https://github.com/Elnur21/brick-breaker-hit",
    demo: "elnur21.github.io/brick-breaker-hit/",
    btn1:"GitHub",
    btn2:"Live Demo"
  },
  {
    id: 3,
    image: GAMEFifteen,
    title: "Game fifteen",
    github: "https://github.com/Elnur21/game-fifteen",
    demo: "https://elnur21.github.io/game-fifteen/",
    btn1:"GitHub",
    btn2:"Live Demo"
  },
  {
    id: 4,
    image: PINGPONG,
    title: "Pingpong game",
    github: "https://github.com/Elnur21/pingpong",
    demo: "https://github.com/Elnur21/pingpong",
    btn1:"GitHub",
    btn2:"No Demo"
  },
  {
    id: 5,
    image: YUMMY,
    title: "Yummy template",
    github: "https://github.com/Elnur21/yummy-template",
    demo: "https://elnur21.github.io/yummy-template/",
    btn1:"GitHub",
    btn2:"Live Demo"
  },
  {
    id: 6,
    image: MELADORA,
    title: "Meladora template server+client",
    github: "https://github.com/Elnur21/meladora-template",
    demo: "https://meladora-template.netlify.app/",
    btn1:"GitHub",
    btn2:"Live Demo"
  },
  {
    id: 7,
    image: SMART,
    title: "Smart edu template MVC",
    github: "https://github.com/Elnur21/smart-edu",
    demo: "https://github.com/Elnur21/smart-edu",
    btn1:"GitHub",
    btn2:"No Demo"
  },
  {
    id: 8,
    image: COZA,
    title: "CozaStore template React+Node",
    github: "https://github.com/Elnur21/coza-store",
    demo: "https://github.com/Elnur21/coza-store",
    btn1:"GitHub",
    btn2:"No Demo"
  },
  {
    id: 9,
    image: SHOP,
    title: "SIXTEEN CLOTHING template",
    github: "https://github.com/Elnur21/Shoping",
    demo: "https://elnur21.github.io/Shoping/",
    btn1:"GitHub",
    btn2:"Live Demo"
  },
  {
    id: 10,
    image: LUCKY,
    title: "Lucky template",
    github: "https://github.com/Elnur21/Lucky-Design-template",
    demo: "https://elnur21.github.io/Lucky-Design-template/",
    btn1:"GitHub",
    btn2:"Live Demo"
  },
  {
    id: 11,
    image: TIMEZONE,
    title: "TimeZone template",
    github: "https://github.com/Elnur21/timezone",
    demo: "https://elnur21.github.io/timezone/",
    btn1:"GitHub",
    btn2:"Live Demo"
  },
  {
    id: 12,
    image: BAND,
    title: "BAND template",
    github: "https://github.com/Elnur21/CSS-simple/tree/main/part2",
    demo: "https://elnur21.github.io/CSS-simple/part2/part2.html",
    btn1:"GitHub",
    btn2:"Live Demo"
  },
  {
    id: 13,
    image: RF,
    title: "Refistration form PHP",
    github: "https://github.com/Elnur21/registration-form",
    demo: "https://elnur21.github.io/registration-form/index-en.html",
    btn1:"GitHub",
    btn2:"Live Demo"
  },
]

const Portfolio = () => {
  return (
    <section id='portfolio'>
      <h5>My Recent Works</h5>
      <h2>Portfolio</h2>

      <div className="container portfolio__container">
        {
          data.map(({ id, image, title, github, demo, btn1, btn2 }) => {
            return (
              <article key={id} className="portfolio__item">
                <div className="portfolio__item-image">
                  <img src={image} alt="project" height={300} />
                </div>

                <h3>{title}</h3>
                <div className="portfolio__item-cta">
                  <a href={github} className='btn' target='_blank' rel="noopener noreferrer">{btn1}</a>
                  <a href={demo} className='btn btn-primary' target='_blank' rel="noopener noreferrer">{btn2}</a>
                </div>
              </article>
            )
          })
        }
      </div>
    </section>
  )
}

export default Portfolio