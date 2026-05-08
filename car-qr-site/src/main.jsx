import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { QRCodeCanvas } from 'qrcode.react'
import { Car, Plus, ArrowLeft, Phone, MapPin } from 'lucide-react'
import './style.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function getCarPageUrl(id) {
  return `${window.location.origin}${import.meta.env.BASE_URL}car/${id}`
}

function App() {
  const path = window.location.pathname.replace(import.meta.env.BASE_URL, '/')

  if (path.startsWith('/admin')) return <AdminPage />
  if (path.startsWith('/car/')) {
    const id = path.split('/car/')[1]
    return <CarPage id={id} />
  }

  return <HomePage />
}

function HomePage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCars()
  }, [])

  async function loadCars() {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setCars(data || [])
    setLoading(false)
  }

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Car QR Sales</p>
          <h1>Cars available now</h1>
          <p>Scan the QR code on a car to open its full information page.</p>
        </div>
        <a className="adminLink" href={`${import.meta.env.BASE_URL}admin`}>Admin</a>
      </header>

      {loading ? <p>Loading cars...</p> : null}

      <section className="grid">
        {cars.map(car => (
          <a className="card" href={`${import.meta.env.BASE_URL}car/${car.id}`} key={car.id}>
            <img src={car.image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900'} alt={car.title} />
            <div className="cardBody">
              <div className="status">{car.status}</div>
              <h2>{car.title}</h2>
              <p>{car.year || ''} {car.fuel || ''} {car.gearbox || ''}</p>
              <strong>€{Number(car.price || 0).toLocaleString()}</strong>
            </div>
          </a>
        ))}
      </section>
    </main>
  )
}

function CarPage({ id }) {
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCar() {
      const { data } = await supabase.from('cars').select('*').eq('id', id).single()
      setCar(data)
      setLoading(false)
    }
    loadCar()
  }, [id])

  if (loading) return <main className="page"><p>Loading...</p></main>
  if (!car) return <main className="page"><p>Car not found.</p></main>

  const pageUrl = getCarPageUrl(car.id)

  return (
    <main className="page">
      <a className="back" href={import.meta.env.BASE_URL}><ArrowLeft size={18}/> Back to cars</a>

      <section className="details">
        <img className="mainImage" src={car.image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900'} alt={car.title} />

        <div className="info">
          <div className="status">{car.status}</div>
          <h1>{car.title}</h1>
          <p className="price">€{Number(car.price || 0).toLocaleString()}</p>

          <div className="specs">
            <Spec label="Brand" value={car.brand} />
            <Spec label="Model" value={car.model} />
            <Spec label="Year" value={car.year} />
            <Spec label="Mileage" value={car.mileage ? `${Number(car.mileage).toLocaleString()} km` : ''} />
            <Spec label="Fuel" value={car.fuel} />
            <Spec label="Gearbox" value={car.gearbox} />
            <Spec label="Engine" value={car.engine} />
            <Spec label="NCT" value={car.nct} />
            <Spec label="Tax" value={car.tax} />
            <Spec label="VIN" value={car.vin} />
          </div>

          <p className="description">{car.description}</p>

          <div className="contact">
            {car.phone ? <a href={`tel:${car.phone}`}><Phone size={18}/> {car.phone}</a> : null}
            {car.location ? <span><MapPin size={18}/> {car.location}</span> : null}
          </div>

          <div className="qrBox">
            <QRCodeCanvas value={pageUrl} size={160} />
            <p>QR code for this car</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function Spec({ label, value }) {
  if (!value) return null
  return (
    <div className="spec">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function AdminPage() {
  const emptyForm = {
    title: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    price: '',
    fuel: '',
    gearbox: '',
    engine: '',
    nct: '',
    tax: '',
    vin: '',
    location: '',
    description: '',
    phone: '',
    image_url: '',
    status: 'available'
  }

  const [form, setForm] = useState(emptyForm)
  const [cars, setCars] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadCars()
  }, [])

  async function loadCars() {
    const { data } = await supabase.from('cars').select('*').order('created_at', { ascending: false })
    setCars(data || [])
  }

  function updateField(name, value) {
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function addCar(e) {
    e.preventDefault()
    setMessage('Saving...')

    const payload = {
      ...form,
      year: form.year ? Number(form.year) : null,
      mileage: form.mileage ? Number(form.mileage) : null,
      price: form.price ? Number(form.price) : null
    }

    const { error } = await supabase.from('cars').insert(payload)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Car added successfully.')
    setForm(emptyForm)
    loadCars()
  }

  async function deleteCar(id) {
    const ok = confirm('Delete this car?')
    if (!ok) return
    await supabase.from('cars').delete().eq('id', id)
    loadCars()
  }

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Add your cars</h1>
          <p>For MVP, paste image URLs. Later we can add real photo upload.</p>
        </div>
        <a className="adminLink" href={import.meta.env.BASE_URL}>Public site</a>
      </header>

      <form className="form" onSubmit={addCar}>
        {Object.keys(emptyForm).map(key => (
          key === 'description' ? (
            <textarea key={key} placeholder={key} value={form[key]} onChange={e => updateField(key, e.target.value)} />
          ) : key === 'status' ? (
            <select key={key} value={form[key]} onChange={e => updateField(key, e.target.value)}>
              <option value="available">available</option>
              <option value="reserved">reserved</option>
              <option value="sold">sold</option>
            </select>
          ) : (
            <input key={key} placeholder={key} value={form[key]} onChange={e => updateField(key, e.target.value)} />
          )
        ))}
        <button><Plus size={18}/> Add car</button>
      </form>

      {message ? <p className="message">{message}</p> : null}

      <section className="adminList">
        {cars.map(car => (
          <div className="adminItem" key={car.id}>
            <div>
              <strong>{car.title}</strong>
              <p>{getCarPageUrl(car.id)}</p>
            </div>
            <div className="adminActions">
              <QRCodeCanvas value={getCarPageUrl(car.id)} size={80} />
              <a href={`${import.meta.env.BASE_URL}car/${car.id}`}>Open</a>
              <button type="button" onClick={() => deleteCar(car.id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
