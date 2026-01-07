import React from 'react'
import Mainbanner from '../compoenets/Mainbanner'
import Categories from '../compoenets/Categories'
import BestSeller from '../compoenets/BestSeller'
import BottomBanner from '../compoenets/BottomBanner'
import NewsLetter from '../compoenets/NewsLetter'

const Home = () => {
    return (
        <div className='mt-10'>
            <Mainbanner />
            <Categories />
            <BestSeller />
            <BottomBanner/>
            <NewsLetter/>

        </div>
    )
}

export default Home
