import React from 'react'
import './footer.css'
import { FaLinkedin, FaMailBulk, FaWhatsapp } from 'react-icons/fa'
import { FiInstagram } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer>
      <a href="/#" className="footer__logo">Elnur Maharramov</a>

      <ul className="permalinks">
        <li><a href="#">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#portfolio">Portfolio</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="footer__socials">
        <a href="https://instagram.com/elnur.m21" target="_blank" rel="noopener noreferrer"><FiInstagram /></a>
        <a href="https://api.whatsapp.com/send/?phone=%2B994706561424" target="_blank" rel="noopener noreferrer"><FaWhatsapp/></a>
        <a href="mailto:elnur2370@gmail.com" target="_blank" rel="noopener noreferrer"><FaMailBulk/></a>
        <a href="https://linkedin.com/in/elnur-meherremov" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
      </div>

      <div className="footer__copyright">
        <small>&copy; Elnur Maharramov. All rights reserved</small>
      </div>
    </footer>
  )
}

export default Footer