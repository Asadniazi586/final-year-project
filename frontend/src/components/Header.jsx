import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'

const words = [
  { text: 'Expert Surgeons', color: 'text-yellow-400' },
  { text: 'Heart Specialists', color: 'text-yellow-400' },
  { text: 'Neurologists', color: 'text-yellow-400' },
  { text: 'Pediatricians', color: 'text-yellow-400' },
]

const Header = () => {
  const [wordIndex, setWordIndex] = useState(0)
  const [letterIndex, setLetterIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [displayed, setDisplayed] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const currentWord = words[wordIndex].text
    const isEnd = letterIndex === currentWord.length
    const isStart = letterIndex === 0

    const typingSpeed = deleting ? 50 : 100

    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(currentWord.substring(0, letterIndex + 1))
        setLetterIndex(letterIndex + 1)
        if (letterIndex + 1 === currentWord.length) {
          setTimeout(() => setDeleting(true), 1200)
        }
      } else {
        setDisplayed(currentWord.substring(0, letterIndex - 1))
        setLetterIndex(letterIndex - 1)
        if (letterIndex - 1 === 0) {
          setDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [letterIndex, deleting, wordIndex])

  // Cursor blink
  useEffect(() => {
    const cursorBlink = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorBlink)
  }, [])

  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-15'>
      {/* .....Left side..... */}
      <div className='md:w-1/2 flex flex-col lg:mt-[-40px] lg:mb-[-10px] items-start justify-center gap-4  m-auto md:py-[10vw] md:mb-[-30px]'>
        <p className='text-2xl md:text-3xl lg:text-[32px] text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
        <span className='lg:text-[35px]'>Schedule Your Appointments</span><br /> With our{' '}
          <span className={`${words[wordIndex].color}`}>
            {displayed}
            <span className='inline-block w-[1px]'>
              {cursorVisible ? '|' : ' '}
            </span>
          </span>
        </p>
        <div className='flex flex-col mt-2 md:flex-row items-center gap-3 text-white text-sm font-light'>
          <p>
            Experience seamless access to qualified and experienced doctors at Alfazal Hospital. <br className='hidden sm:block' />
            Book your consultations effortlessly—quick, secure, and hassle-free healthcare at your convenience.
          </p>
        </div>
        <a className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 lg:mb-[-20px] hover:scale-105 transition-all duration-300' href="#speciality">
          Get Started <img className='w-3' src={assets.arrow_icon} alt="" />
        </a>
      </div>

      {/* .....Right side..... */}
      <div className='md:w-1/2 relative '>
        <img className='w-full md:absolute bottom-7 h-85 rounded-lg ml-7' src={assets.grp} alt="" />
      </div>
    </div>
  )
}

export default Header
