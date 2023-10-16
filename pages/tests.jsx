import React from 'react'
// import ConfettiExplosion from 'react-confetti-explosion';
// import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'


function Tests() {
    // const { width, height } = useWindowSize()

  return (
    <div className=''>
        <Confetti
            width={1600}
            height={800}
            tweenDuration={5000}
            numberOfPieces={50}
        />
    </div>
  )
}

export default Tests