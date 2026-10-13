import { useMemo, useState } from 'react'
import { ArrowUpRight, BadgeCheck, FileCheck2, FileText, Search, ShieldCheck } from 'lucide-react'
import Modal from '../../components/common/Modal'
import { mockServices } from '../../data/mockServices'
import './AdminServicesPage.css'

export default function AdminServicesPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All services')
  const [selectedService, setSelectedService] = useState(null)
  const categories = useMemo(() => [...new Set(mockServices.map((service) => service.category))], [])
  const certificateCount = mockServices.filter((service) => service.category === 'Certificates').length
  const filteredServices = mockServices.filter((service) => {
    const matchesCategory = activeCategory === 'All services' || service.category === activeCategory
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || `${service.name} ${service.category} ${service.description}`.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })

  return (
    <main className="catalog-page">
      <section className="catalog-hero" aria-labelledby="catalog-heading">
        <div className="catalog-hero__copy">
          <span className="catalog-eyebrow">
            <ShieldCheck size={15} aria-hidden="true" />
            Administration · Student support
          </span>
          <h1 id="catalog-heading">Service catalog</h1>
          <p>Explore student services and review what each certificate request is for.</p>
        </div>
        <div className="catalog-hero__mark" aria-hidden="true">
          <FileCheck2 size={37} strokeWidth={1.7} />
        </div>
      </section>

      <section className="catalog-stats" aria-label="Catalog overview">
        <div className="catalog-stat">
          <span className="catalog-stat__icon catalog-stat__icon--green"><FileText size={19} /></span>
          <div><strong>{mockServices.length}</strong><span>Student services</span></div>
        </div>
        <div className="catalog-stat">
          <span className="catalog-stat__icon catalog-stat__icon--blue"><BadgeCheck size={19} /></span>
          <div><strong>{certificateCount}</strong><span>Certificate types</span></div>
        </div>
        <div className="catalog-stat">
          <span className="catalog-stat__icon catalog-stat__icon--violet"><ShieldCheck size={19} /></span>
          <div><strong>{categories.length}</strong><span>Service categories</span></div>
        </div>
      </section>

      <section className="catalog-list" aria-labelledby="catalog-list-heading">
        <div className="catalog-list__heading">
          <div>
            <h2 id="catalog-list-heading">Browse services</h2>
            <p>Choose a service to see its overview and request guidance.</p>
          </div>
          <label className="catalog-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search services</span>
            <input
              type="search"
              placeholder="Search services..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        <div className="catalog-filters" aria-label="Filter services by category">
          {['All services', ...categories].map((category) => (
            <button
              key={category}
              type="button"
              className={`catalog-filter${activeCategory === category ? ' is-active' : ''}`}
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredServices.length > 0 ? (
          <div className="catalog-grid">
            {filteredServices.map((service, index) => (
              <article
                key={service.id}
                className="catalog-card"
                style={{ '--card-index': index }}
              >
                <div className="catalog-card__top">
                  <span className="catalog-card__icon"><FileText size={20} aria-hidden="true" /></span>
                  <span className="catalog-status"><span />Operational</span>
                </div>
                <span className="catalog-card__category">{service.category}</span>
                <h3>{service.name}</h3>
                <p className="catalog-card__description">{service.description}</p>
                <button
                  type="button"
                  className="catalog-card__link"
                  onClick={() => setSelectedService(service)}
                  aria-label={`View details for ${service.name}`}
                >
                  View details <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="catalog-empty" role="status">
            <Search size={22} aria-hidden="true" />
            <strong>No matching services</strong>
            <p>Try another search or select a different category.</p>
          </div>
        )}
      </section>

      <Modal
        open={Boolean(selectedService)}
        title={selectedService?.name || 'Service details'}
        onClose={() => setSelectedService(null)}
      >
        {selectedService && (
          <div className="catalog-detail">
            <div className="catalog-detail__meta">
              <span className="catalog-detail__category">{selectedService.category}</span>
              <span className="catalog-status"><span />Operational</span>
            </div>
            <p className="catalog-detail__description">{selectedService.description}</p>

            {selectedService.details ? (
              <>
                <section className="catalog-detail__section">
                  <h4>What it is for</h4>
                  <p>{selectedService.details.purpose}</p>
                </section>
                <section className="catalog-detail__section">
                  <h4>When to request it</h4>
                  <p>{selectedService.details.bestFor}</p>
                </section>
                <section className="catalog-detail__section">
                  <h4>Details to have ready</h4>
                  <ul>
                    {selectedService.details.prepare.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </section>
                <aside className="catalog-detail__note">
                  <ShieldCheck size={18} aria-hidden="true" />
                  <p>{selectedService.details.importantNote}</p>
                </aside>
              </>
            ) : (
              <section className="catalog-detail__section">
                <h4>Request overview</h4>
                <p>This service helps students with their {selectedService.name.toLowerCase()} needs. Contact the administration to confirm the information and supporting documents required.</p>
              </section>
            )}
            <div className="catalog-detail__actions">
              <button type="button" onClick={() => setSelectedService(null)}>
                Close details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  )
}
