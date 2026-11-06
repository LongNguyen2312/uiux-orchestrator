import { useState } from 'react'

// Deliberately weak page (fixture): ignores shared components and tokens.
export default function Settings() {
  const [name, setName] = useState('Jordan Rivera')
  const [email, setEmail] = useState('jordan@acme.example')
  const [company, setCompany] = useState('Acme Inc.')
  const [timezone, setTimezone] = useState('Europe/Berlin')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(false)
  const [weekly, setWeekly] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div style={{ background: '#ffffff', padding: 20, borderRadius: 4, border: '1px solid #ddd' }}>
      <h1 style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>Settings</h1>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 8, padding: 6, border: '1px solid #ccc' }} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 8, padding: 6, border: '1px solid #ccc' }} />
      <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 8, padding: 6, border: '1px solid #ccc' }} />
      <input placeholder="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 8, padding: 6, border: '1px solid #ccc' }} />
      <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
        <label><input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} /> email</label>{' '}
        <label><input type="checkbox" checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} /> push</label>{' '}
        <label><input type="checkbox" checked={weekly} onChange={(e) => setWeekly(e.target.checked)} /> weekly</label>{' '}
        <label><input type="checkbox" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} /> 2fa</label>
      </div>
      <div style={{ marginTop: 16 }}>
        <button style={{ background: '#3b5bdb', color: '#fff', padding: '4px 10px', fontSize: 12 }} onClick={() => {}}>Save</button>{' '}
        <button style={{ background: '#3b5bdb', color: '#fff', padding: '4px 10px', fontSize: 12 }} onClick={() => confirm('Delete?')}>Delete account</button>
      </div>
    </div>
  )
}
