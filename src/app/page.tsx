import Banner from "@/components/Home/Banner";
import Information from "@/components/Home/Information";
import Divider from "@/components/Home/Divider";
import Service from "@/components/Home/Service";
import CarModel from "@/components/Home/CarModel";

export default function Home() {
  return (
    <div>
      <Banner />
      <Divider />
      <Information />
      <Service />
      <CarModel />
    </div>
  )
}
