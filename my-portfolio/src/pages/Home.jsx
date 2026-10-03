import CoverSpread from '../components/sections/CoverSpread'
import CoverStories from '../components/sections/CoverStories'
import { BackCover, HowItWorks, PriceList, SoundFamiliar } from '../components/sections/Departments'

export default function Home() {
  return (
    <main id="main">
      <CoverSpread />
      <CoverStories />
      <SoundFamiliar />
      <HowItWorks id="how-it-works" />
      <PriceList />
      <BackCover />
    </main>
  )
}
