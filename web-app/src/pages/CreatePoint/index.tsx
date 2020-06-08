import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import "./styles.css";
import logo from "../../assets/logo.svg";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import api from "../../services/api";
import Axios from "axios";
import Dropzone from "../../components/Dropzone";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    -30.035361,
    -51.242069,
  ]);
  const [selectedPosition, setPosition] = useState<[number, number]>(
    initialPosition
  );
  const [selectedFile, setSelectedFile] = useState<File>();

  useEffect(() => {
    api.get<Item[]>("items").then((response) => {
      const result = (response.data || []).map((item) => ({
        ...item,
        image_url: `${response.config.baseURL}${item.image_url}`,
      }));

      setItems(result);
    });
  }, []);

  useEffect(() => {
    Axios.get<IBGEUFResponse[]>(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
    ).then((response) => {
      const ufInitials = response.data.map((uf) => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    Axios.get<IBGECityResponse[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
    ).then((response) => {
      const citiesByUf = response.data.map((city) => city.nome);
      setCities(citiesByUf);
    });
  }, [selectedUf]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setInitialPosition([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const history = useHistory();

  const onSelectUfHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    const uf = event.target.value;
    setSelectedUf(uf);
  };

  const onSelectCityHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    const uf = event.target.value;
    setSelectedCity(uf);
  };

  const onMapClickHandler = (event: LeafletMouseEvent) => {
    setPosition([event.latlng.lat, event.latlng.lng]);
  };

  const onHandleInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const onItemClickHandler = (id: number) => {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems([...filteredItems]);
    } else setSelectedItems([...selectedItems, id]);
  };

  const onSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();

    const { name, email, whatsapp } = formData;

    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append("name", name);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("uf", uf);
    data.append("city", city);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("items", items.join(","));
    if (selectedFile) data.append("image", selectedFile);
    else {
      alert("Selecione um imagem!");
      return;
    }

    await api.post("points", data);

    alert(`${name} create succefully`);

    history.push("/");
  };

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={onSubmitHandler}>
        <h1>Cadastro de Ponto de Coleta</h1>
        <Dropzone onFileUploaded={setSelectedFile} />
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da Entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={onHandleInputHandler}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-maill</label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={onHandleInputHandler}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={onHandleInputHandler}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
          </legend>
          <span>Selecione o endereço no mapa</span>
          <div>
            <Map center={initialPosition} zoom={15} onClick={onMapClickHandler}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={selectedPosition}>
                <Popup>Torre do Gasômetro.</Popup>
              </Marker>
            </Map>
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={onSelectUfHandler}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={onSelectCityHandler}
              >
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítems de Coleta</h2>
          </legend>
          <ul className="items-grid">
            {items.map((item) => (
              <li
                className={selectedItems.includes(item.id) ? "selected" : ""}
                key={item.id}
                onClick={() => onItemClickHandler(item.id)}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de Coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
