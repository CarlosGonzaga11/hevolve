import { Calendar, Mail, Target, User2 } from "lucide-react";
import CardUser from "../components/cardUser";

export default function User() {
  return (
    <div className="flex flex-col w-full ">
      <div className="mt-12 px-6 ">
        <h1 className="uppercase text-3xl font-bold text-[#FAFAFA]">
          Meu perfil
          
        </h1>
      </div>
      <div className="mt-8 flex w-full flex-col px-6 gap-2">
        <CardUser
          icon={<User2 color="#22c55e" />}
          title="Nome"
          subject="Joao Silva"
        />

        <CardUser
          icon={<Mail color="#22c55e" />}
          title="Email"
          subject="Joao@mail.com"
        />
        <CardUser
          icon={<Target color="#22c55e" />}
          title="Objetivo"
          subject="Hipertrofia"
        />

        <CardUser
          icon={<Calendar color="#22c55e" />}
          title="Plano"
          subject="Pro-Ativo"
        />
      </div>
    </div>
  );
}
