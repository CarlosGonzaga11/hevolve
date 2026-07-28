import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function MyTrains() {
  const [listaTreinosSalvos, setListaTreinosSalvos] = useState([]);
  async function buscarTreinos() {
    const { data, error } = await supabase
      .from("fichas")
      .select("id,nome,itens_treino(id,series,repeticoes,exrecicio_id)");
    if (error) {
      console.error("Error ao buscar:", error);
    } else {
      setListaTreinosSalvos(data);
    }
    console.log("cheguei aqui")
  }

  useEffect(() => {
    buscarTreinos();
  });
  return (
    <div>
      Meus
      <div>
        {listaTreinosSalvos.map((treino) => (
          <div
            key={treino.id}
            style={{
              background: "#222",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ color: "#22c55e" }}>{treino.nome}</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {treino.itens_treino.map((item) => (
                <li key={item.id} style={{ fontSize: "14px", color: "#ccc" }}>
                  Exercicio ID: {item.exercicio_id} - {item.series}x
                  {item.repeticoes}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
