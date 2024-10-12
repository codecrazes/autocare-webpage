"use client";
import Spinner from "@/components/Spinner/Spinner";
import { useEffect, useState } from "react";

export default function Loading() {

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const timer = setTimeout(()=>{
        setLoading(false);
      },5000);

      return () => clearTimeout(timer);
    }, [])
    
  return (
    <div>
        <div className="min-h-screen flex justify-center items-center">
          {loading ? <Spinner /> : <h1 className="text-3xl font-bold">Carregado...</h1>}
        </div>
    </div>
  )
}
