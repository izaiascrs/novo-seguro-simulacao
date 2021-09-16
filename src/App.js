import React, { useState } from "react";
import Logo from "./images/logo-form.jpg";
import Check from "./images/check.jpg";
import Loading from "./components/Logo";
import InputMask from "react-input-mask";

import { calculateInsurance } from "./api";

import "./App.css";

const initialData = {
  ctc_nome: "",
  ctc_telefone: "",
  ctc_cep: "",
  ctc_placa: "",
};
const features = [
  "Incêndio",
  "Roubo",
  "Furto",
  "Colisão",
  "Chaveiro",
  "Fenômenos da natureza",
  "Terceio de R$ 30.000,00",
  "Assistência 24h",
  "Socorro elétrico e mecânico 150km",
  "Retorno ao domicílio",
  "Pane seca",
  "Troca de pneu",
  "Reboque após sinistro",
];

function App() {
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(true);
  const [formData, setFormData] = useState(initialData);
  const [responseData, setResponseData] = useState(null);
  const [loading, setIsLoading] = useState(false);

  const updateState = (next = true) => {
    setIsLoading(true);
    if (step === 2) {
      setStep(0);
    } else {
      setStep((step) => (step += 1));
    }

    if (!next && step === 2) {
      setFormData(initialData);
    }
    setIsLoading(false);

    setFormData(initialData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const { data } = await calculateInsurance(formData);

      if (data.success) {
        setResponseData(data);
        setSuccess(true);
      } else {
        setResponseData(data);
        setSuccess(false);
      }
    } catch (error) {
      console.log(error.status);
      setSuccess(false);
      setResponseData({ message: "Placa ou Cep inválido" });
    }

    setIsLoading(false);
    updateState();
  };

  const LogoContainer = () => (
    <div className="logo-container">
      <img src={Logo} alt="logo" />
    </div>
  );

  return (
    <div className="App">
        {step === 0 && (
          <div className="form-container">
            <LogoContainer />

            {loading ? (
              <Loading />
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <label htmlFor="nome">Nome</label>
                  <input
                    type="text"
                    id="nome"
                    placeholder="seu nome"
                    required
                    value={formData.ctc_nome}
                    onChange={(e) =>
                      setFormData({ ...formData, ctc_nome: e.target.value })
                    }
                  />
                </div>
                <div className="row">
                  <label htmlFor="telefone">Telefone</label>
                  <InputMask
                    mask="(99) 99999-9999"
                    type="text"
                    id="telefone"
                    required
                    placeholder="seu telefone"
                    value={formData.ctc_telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, ctc_telefone: e.target.value })
                    }
                  />
                </div>
                <div className="row">
                  <label htmlFor="cep">Cep</label>
                  <InputMask
                    mask="99999999"
                    type="text"
                    id="cep"
                    required
                    placeholder="seu cep"
                    value={formData.ctc_cep}
                    onChange={(e) =>
                      setFormData({ ...formData, ctc_cep: e.target.value })
                    }
                  />
                </div>
                <div className="row">
                  <label htmlFor="placa">Placa</label>
                  <input
                    type="text"
                    id="placa"
                    maxLength="7"
                    required
                    placeholder="sua placa"
                    value={formData.ctc_placa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ctc_placa: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
                <div className="row">
                  <button type="submit">Cotação</button>
                </div>
              </form>
            )}
          </div>
        )}

        {!success && step === 1 && (
          <div className="error-container">
            <LogoContainer />

            <div className="error-message">
              <h2>! {responseData.message}</h2>
            </div>

            <button className="orange" onClick={() => setStep(0)}>Tentar Novamente</button>
          </div>
        )}

        {step === 1 && success && (
          <div className="response-container">
            <LogoContainer />
            <div className="row">
              <h3>Dados pessoais</h3>
              <div className="personal-info">
                <p>
                  Nome : <span>{responseData.segurado_nome}</span>
                </p>
                <p>
                  Marca : <span>{responseData.veiculo_marca}</span>
                </p>
                <p>
                  Modelo : <span>{responseData.veiculo_modelo}</span>
                </p>
              </div>
            </div>

            <div className="row">
              <h3>Cobertura</h3>
              <div className="features-container">
                {features.map((feat, i) => (
                  <div className="feature" key={i}>
                    <img src={Check} alt="check" />
                    <p>{feat}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <h3>Valores</h3>
              <div className="personal-info">
                <p>
                  Franquia : <span>R$ {responseData.veiculo_franquia}</span>
                </p>
                <p>
                  Valor médio Mensal :{" "}
                  <span>R$ {responseData.premio_total}</span>
                </p>
                <p>
                  <span>
                    Franquia de 18 á 24 anos será o dobro da franquia normal
                  </span>
                </p>
              </div>
            </div>

                <div className="buttons-container">
                  <button className="comprar" onClick={updateState}>
                    Comprar
                  </button>
                  <button onClick={() => setStep(0)} className="cancel">Cancelar</button>
                </div>  
          </div>
        )}
        {step === 2 && (
          <div className="congrats-container">
            <LogoContainer />

            <div className="row">
              <h1>Parabéns!!!</h1>

              <p>
                Você entrou no pré-cadastro para ser um dos primeiros segurados
                a fazer parte da Novo Seguros
              </p>
              <button onClick={() => updateState(false)}>Finalizar</button>
            </div>
          </div>
        )}
      </div>
  );
}

export default App;
