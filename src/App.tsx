import { useState, useEffect, useRef, type ReactNode } from 'react'

// Helper to resolve asset paths with Vite BASE_URL (essential for GitHub Pages)
const assetUrl = (path: string): string => {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`
  return `${base}${path.replace(/^\//, '')}`
}

const PRODUCTION_URL = 'https://manjumjhalu.github.io/Karthik-Thejashwini/'
const MAPS_URL = 'https://maps.app.goo.gl/E2NjCYftJhQpvYkd9'
const WEDDING_TARGET_TIME = new Date('2026-11-15T09:00:00+05:30').getTime()

// Local media paths as requested by user
const media = {
  hero: assetUrl('photos/couple.jpeg'),
  groom: assetUrl('photos/groom.jpeg'),
  bride: assetUrl('photos/bride.jpeg'),
  videoMOV: assetUrl('videos/memory.MOV'),
  videoMP4: assetUrl('videos/memory.mp4'),
  song: assetUrl('Song/songs.mp3'),
}

type IconName =
  | 'arrow'
  | 'music'
  | 'pause'
  | 'share'
  | 'pin'
  | 'play'
  | 'volume'
  | 'volumeX'
  | 'calendar'
  | 'copy'
  | 'check'
  | 'info'
  | 'external'

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    music: (
      <>
        <path d="M9 18V5l10-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </>
    ),
    pause: <path d="M9 5v14M15 5v14" />,
    share: (
      <>
        <path d="M20 11.5A8.3 8.3 0 0 1 7.7 18.8L3 20l1.3-4.5A8.3 8.3 0 1 1 20 11.5Z" />
        <path d="M8 8.5c1 3 2.5 4.5 5.5 5.5" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    play: <path d="m9 7 8 5-8 5Z" />,
    volume: (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    ),
    volumeX: (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="22" y1="9" x2="16" y2="15" />
        <line x1="16" y1="9" x2="22" y2="15" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    copy: (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </>
    ),
    external: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </>
    ),
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <i>✦</i>
      <span />
    </div>
  )
}

function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className={`section-heading ${light ? 'section-heading--light' : ''}`}>
      <p>{eyebrow}</p>
      <div className="display">{title}</div>
      <Ornament />
    </div>
  )
}

// Fallback-aware Image Component
function ImageWithFallback({
  src,
  alt,
  monogram,
  subtitle,
  className,
}: {
  src: string
  alt: string
  monogram: string
  subtitle: string
  className?: string
}) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={`image-fallback ${className ?? ''}`} role="img" aria-label={alt}>
        <div className="fallback-icon">✦</div>
        <div className="fallback-monogram">{monogram}</div>
        <p>{subtitle}</p>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  )
}

// Calendar links generator
function createGoogleCalendarUrl({
  title,
  startIso,
  endIso,
  details,
  location,
}: {
  title: string
  startIso: string
  endIso: string
  details: string
  location: string
}) {
  const formatIsoForGCal = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const dates = `${formatIsoForGCal(startIso)}/${formatIsoForGCal(endIso)}`
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title,
  )}&dates=${dates}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`
}

// Event Card Component
function EventCard({
  kind,
  day,
  date,
  time,
  startIso,
  endIso,
  traditional = false,
}: {
  kind: string
  day: string
  date: string
  time: string
  startIso: string
  endIso: string
  traditional?: boolean
}) {
  const gcalUrl = createGoogleCalendarUrl({
    title: `Wedding: ${kind} — Karthik M. & Thejashwini M.H.`,
    startIso,
    endIso,
    details: `Celebrate the wedding of Karthik M. & Thejashwini M.H. Venue: Shree Guddada Malleshwara Samudaya Bhavana, Mallapura. Directions: ${MAPS_URL}`,
    location: 'Shree Guddada Malleshwara Samudaya Bhavana, Mallapura, Bhadravathi Taluk, Karnataka',
  })

  return (
    <article className={`event-card ${traditional ? 'event-card--traditional' : ''}`}>
      <p className="eyebrow">{traditional ? 'THE SACRED CEREMONY' : 'AN EVENING OF CELEBRATION'}</p>
      <div className="event-title">{kind}</div>
      <div className="event-date">
        <strong>{date.split(' ')[0]}</strong>
        <span>{date.substring(date.indexOf(' ') + 1)}</span>
      </div>
      <div className="event-meta">
        <p>{day}</p>
        <i />
        <p>{time}</p>
      </div>
      <div className="event-venue">
        <Icon name="pin" />
        <p>
          <strong>
            Shree Guddada Malleshwara
            <br />
            Samudaya Bhavana
          </strong>
          <span>Mallapura, Bhadravathi Taluk, Karnataka</span>
        </p>
      </div>
      <div className="event-actions">
        <a
          className="button button--secondary"
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Get directions to ${kind} at Shree Guddada Malleshwara Samudaya Bhavana`}
        >
          <span>Get directions</span>
          <Icon name="arrow" />
        </a>
        <a
          className="btn-calendar"
          href={gcalUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Add ${kind} to Google Calendar`}
        >
          <Icon name="calendar" />
          <span>Add to Calendar</span>
        </a>
      </div>
    </article>
  )
}

export default function App() {
  // 1. Language Toggle (English / Kannada)
  const [lang, setLang] = useState<'kn' | 'en'>('en')

  // 2. Real-Time Dynamic Countdown (15 November 2026, 9:00 AM IST)
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft())

  function calculateTimeLeft() {
    const now = Date.now()
    const difference = WEDDING_TARGET_TIME - now
    if (difference <= 0) {
      return { isLive: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((difference / 1000 / 60) % 60)
    const seconds = Math.floor((difference / 1000) % 60)
    return { isLive: false, days, hours, minutes, seconds }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 3. Functional Background Music Player (public/Song/songs.mp3)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [audioErrorNotice, setAudioErrorNotice] = useState<string | null>(null)

  const togglePlayMusic = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      setAudioErrorNotice(null)
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((err) => {
            console.warn('Audio playback error:', err)
            setIsPlaying(false)
            setAudioErrorNotice('Music file pending at public/Song/songs.mp3')
            setTimeout(() => setAudioErrorNotice(null), 5000)
          })
      }
    }
  }

  const toggleMuteMusic = () => {
    if (!audioRef.current) return
    const nextMuted = !isMuted
    audioRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  // 4. Video Player State & Handlers (public/videos/memory.MOV)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [videoStarted, setVideoStarted] = useState(false)
  const [videoError, setVideoError] = useState(false)

  const handleStartVideo = () => {
    if (!videoRef.current) return
    setVideoStarted(true)
    videoRef.current.play().catch((err) => {
      console.warn('Video playback error:', err)
      setVideoError(true)
    })
  }

  // 5. WhatsApp Sharing & Copy Link
  const [copied, setCopied] = useState(false)

  const shareText = `💍 Wedding Invitation ✨
Karthik M. & Thejashwini M.H.

Together with their families, cordially invite you to celebrate their wedding.

📅 Reception: Saturday, 14 November 2026, 6:30 PM onwards
🕊️ Muhurtham: Sunday, 15 November 2026, 9:00 AM – 9:40 AM IST
📍 Venue: Shree Guddada Malleshwara Samudaya Bhavana, Mallapura, Bhadravathi Taluk, Karnataka

📍 Location: ${MAPS_URL}

View our wedding invitation:
${PRODUCTION_URL}`

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(PRODUCTION_URL).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      })
    }
  }

  return (
    <main>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={media.song}
        preload="metadata"
        loop
        onError={() => {
          setIsPlaying(false)
          console.info('Audio source at public/Song/songs.mp3 is waiting to be placed by user.')
        }}
      />

      {/* Hero Section */}
      <section
        className="hero"
        id="top"
        style={{
          backgroundImage: `url(${media.hero})`,
        }}
      >
        <div className="hero-shade" />
        <nav>
          <a className="monogram" href="#top" aria-label="Karthik & Thejashwini">
            K <i>&</i> T
          </a>
          <a href="#invitation">Invitation</a>
          <a href="#events">Celebration</a>
          <a href="#memories">Memories</a>
          <a href="#venue">Venue</a>
        </nav>
        <div className="hero-content">
          <p className="eyebrow">The Wedding Invitation</p>
          <div className="hero-names">
            <span>Karthik M.</span>
            <i>&</i>
            <span>Thejashwini M.H.</span>
          </div>
          <p className="hero-copy">
            Together with their families, invite you
            <br />
            to celebrate their wedding.
          </p>
          <a className="button" href="#invitation">
            <span>Open invitation</span>
            <Icon name="arrow" />
          </a>
        </div>
        <a className="scroll" href="#invitation" aria-label="Scroll to discover invitation">
          <span>Scroll to discover</span>
          <i />
        </a>
      </section>

      {/* Intro & Language Section */}
      <section className="intro" id="invitation">
        <div className="botanical botanical--left">❦</div>

        <SectionHeading eyebrow="Together, always" title="A Celebration of Love" />

        <div className="lang-toggle" role="tablist" aria-label="Invitation Language">
          <button
            role="tab"
            aria-selected={lang === 'en'}
            className={lang === 'en' ? 'active' : ''}
            onClick={() => setLang('en')}
          >
            English
          </button>
          <button
            role="tab"
            aria-selected={lang === 'kn'}
            className={lang === 'kn' ? 'active' : ''}
            onClick={() => setLang('kn')}
          >
            ಕನ್ನಡ (Kannada)
          </button>
        </div>

        {lang === 'en' ? (
          <div className="english-invitation">
            <p className="lead">
              Two hearts, two families, and a beautiful beginning. Join us as we celebrate the wedding of{' '}
              <em>Karthik</em> and <em>Thejashwini.</em>
              <br />
              <span style={{ display: 'block', marginTop: '16px', fontSize: '18px', fontStyle: 'italic', color: '#78655d' }}>
                With the Love and Blessings of
                <br />
                <strong style={{ fontStyle: 'normal', color: 'var(--brown)', fontSize: '20px' }}>Mallikarjuna &amp; Latha, Kiran</strong>
              </span>
            </p>
            <p style={{ marginTop: '20px', fontSize: '13px', color: '#78655d', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              ✦ Saturday, 14 November & Sunday, 15 November 2026 ✦
            </p>
          </div>
        ) : (
          /* Verified Authentic Traditional Kannada Wedding Patrika */
          <article className="kannada-patrika">
            <p className="shloka">॥ ಶ್ರೀ ಮಹಾಗಣಪತಯೇ ನಮಃ ॥<br />॥ ಶ್ರೀ ಗುಡ್ಡದ ಮಲ್ಲೇಶ್ವರ ಸ್ವಾಮಿ ಪ್ರಸನ್ನಃ ॥</p>
            <div className="patrika-heading">ಶುಭ ವಿವಾಹ ಆಹ್ವಾನ ಪತ್ರಿಕೆ</div>
            <Ornament />

            <div className="kannada-couplenames">
              <div className="groom-name">ವರ: ಶ್ರೀ ಕಾರ್ತಿಕ್ ಎಂ.</div>
              <div className="kannada-amp">ಸಪ್ತಪದಿ ತುಳಿಯುವ ಶುಭ ಬಂಧನ</div>
              <div className="bride-name">ವಧು: ಸೌ|| ತೇಜಸ್ವಿನಿ ಎಂ.ಎಚ್.</div>
            </div>

            <p className="patrika-invitation-body">
              ಬಂಧು-ಮಿತ್ರರೇ, ನಮ್ಮಿಬ್ಬರ ನೂತನ ಜೀವನದ ಪಾವನ ಆರಂಭದ ಶುಭ ಸಂದರ್ಭದಲ್ಲಿ, ನಾವಿಬ್ಬರೂ ಪರಸ್ಪರ ಹಸೆಮಣೆ ಏರುತ್ತಿದ್ದೇವೆ. ಈ ಮಂಗಳಕರ ಸಮಾರಂಭಕ್ಕೆ ತಾವುಗಳು ಸಕುಟುಂಬ ಸಮೇತರಾಗಿ ಆಗಮಿಸಿ, ನವ ದಂಪತಿಗಳಿಗೆ ತಮ್ಮ ಪ್ರೀತಿಯ ಆಶೀರ್ವಾದವನ್ನು ನೀಡಿ ಶುಭ ಹಾರೈಸಬೇಕಾಗಿ ಭಕ್ತಿಪೂರ್ವಕವಾಗಿ ಆಹ್ವಾನಿಸುತ್ತೇವೆ.
            </p>

            <div className="patrika-events-box">
              <div className="kannada-event-item">
                <strong>ಆರತಕ್ಷತೆ (Reception)</strong>
                <p>ಶನಿವಾರ, 14 ನವೆಂಬರ್ 2026</p>
                <p>ಸಂಜೆ 6:30 ರಿಂದ</p>
              </div>
              <div className="kannada-event-item">
                <strong>ಶುಭ ಮುಹೂರ್ತ (Muhurtham)</strong>
                <p>ಭಾನುವಾರ, 15 ನವೆಂಬರ್ 2026</p>
                <p>ಬೆಳಗ್ಗೆ 9:00 ರಿಂದ 9:40 ರ ವರೆಗೆ</p>
              </div>
            </div>

            <div className="patrika-venue">
              <strong>ಸಮಾರಂಭದ ಸ್ಥಳ:</strong> ಶ್ರೀ ಗುಡ್ಡದ ಮಲ್ಲೇಶ್ವರ ಸಮುದಾಯ ಭವನ, ಮಲ್ಲಾಪುರ, ಭದ್ರಾವತಿ ತಾಲ್ಲೂಕು, ಕರ್ನಾಟಕ.
            </div>

            <p className="patrika-blessing">
              ತಮ್ಮ ಪ್ರೀತಿಯ ಆಗಮನವನ್ನು ಸದಾ ಬಯಸುವವರು:<br />
              <strong>ಕಾರ್ತಿಕ್ ಎಂ. ಮತ್ತು ತೇಜಸ್ವಿನಿ ಎಂ.ಎಚ್.</strong><br />
              ಹಾಗೂ ಶ್ರೀ ಮಲ್ಲಿಕಾರ್ಜುನ &amp; ಶ್ರೀಮತಿ ಲತಾ, ಕಿರಣ್ ಮತ್ತು ಸಮಸ್ತ ಕುಟುಂಬ ವರ್ಗ.
            </p>
          </article>
        )}

        <div className="botanical botanical--right">❦</div>
      </section>

      {/* Events Section */}
      <section className="events" id="events">
        <SectionHeading eyebrow="Save the date" title="The Wedding Celebrations" />
        <div className="event-grid">
          <EventCard
            kind="Wedding Reception"
            day="Saturday"
            date="14 November 2026"
            time="6:30 PM onwards"
            startIso="2026-11-14T18:30:00+05:30"
            endIso="2026-11-14T23:00:00+05:30"
          />
          <EventCard
            kind="Muhurtham"
            day="Sunday"
            date="15 November 2026"
            time="9:00 AM – 9:40 AM IST"
            startIso="2026-11-15T09:00:00+05:30"
            endIso="2026-11-15T09:40:00+05:30"
            traditional
          />
        </div>
      </section>

      {/* Real-Time Dynamic Countdown Section */}
      <section className="countdown" aria-label="Wedding Countdown">
        <p className="eyebrow">Counting down to forever</p>
        <p className="countdown-target-label">Muhurtham: 15 November 2026 · 9:00 AM IST</p>

        {timeLeft.isLive ? (
          <div className="countdown-live">
            <span className="countdown-live-badge">✨ Celebrations Have Commenced ✨</span>
            <h3>The Sacred Muhurtham is Here!</h3>
            <p>
              Heartiest congratulations to Karthik M. &amp; Thejashwini M.H. as they embark on this sacred journey of eternal love and togetherness.
            </p>
          </div>
        ) : (
          <div className="countdown-grid">
            <div className="countdown-unit">
              <strong>{String(timeLeft.days).padStart(2, '0')}</strong>
              <span>Days</span>
            </div>
            <div className="countdown-unit">
              <strong>{String(timeLeft.hours).padStart(2, '0')}</strong>
              <span>Hours</span>
            </div>
            <div className="countdown-unit">
              <strong>{String(timeLeft.minutes).padStart(2, '0')}</strong>
              <span>Minutes</span>
            </div>
            <div className="countdown-unit">
              <strong>{String(timeLeft.seconds).padStart(2, '0')}</strong>
              <span>Seconds</span>
            </div>
          </div>
        )}
      </section>

      {/* Couple Profiles (Groom first always) */}
      <section className="couple">
        <SectionHeading eyebrow="The beautiful beginning" title="Two Souls, One Story" />
        <div className="portrait-grid">
          <figure>
            <div className="portrait">
              <ImageWithFallback
                src={media.groom}
                alt="Portrait of the Groom Karthik M."
                monogram="K"
                subtitle="Karthik M."
              />
            </div>
            <figcaption>
              <span>The Groom</span>
              <strong>Karthik M.</strong>
            </figcaption>
          </figure>

          <div className="couple-mark">&amp;</div>

          <figure>
            <div className="portrait">
              <ImageWithFallback
                src={media.bride}
                alt="Portrait of the Bride Thejashwini M.H."
                monogram="T"
                subtitle="Thejashwini M.H."
              />
            </div>
            <figcaption>
              <span>The Bride</span>
              <strong>Thejashwini M.H.</strong>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Memories Video Section (memory.MOV with browser compatibility & native controls) */}
      <section className="memories" id="memories">
        <SectionHeading eyebrow="A story in frames" title="Our Beautiful Memories" />

        <div className="video-player-container">
          <video
            ref={videoRef}
            className="video-element"
            controls={videoStarted}
            poster={media.hero}
            playsInline
            preload="metadata"
            onError={() => {
              console.warn('Video failed to load or codec unsupported.')
              setVideoError(true)
            }}
          >
            {/* Primary MOV source requested by user */}
            <source src={media.videoMOV} type="video/quicktime" />
            {/* Automatic MP4 fallback for broad browser support */}
            <source src={media.videoMP4} type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>

          {!videoStarted && (
            <button
              className="video-overlay-btn"
              onClick={handleStartVideo}
              aria-label="Play wedding memory film"
            >
              <div className="video-play-disc">
                <Icon name="play" />
              </div>
              <p>Watch our memory film</p>
            </button>
          )}
        </div>

        <p className="film-caption">“Every moment leads to a beautiful beginning.”</p>

        {/* Creative Gallery (using available local media and sacred vows without fake portraits) */}
        <div className="gallery">
          <figure className="gallery-a">
            <ImageWithFallback
              src={media.hero}
              alt="Karthik M. & Thejashwini M.H. Together"
              monogram="K & T"
              subtitle="Together in Love"
            />
            <div className="gallery-badge">Together Forever</div>
          </figure>

          <figure className="gallery-b">
            <ImageWithFallback
              src={media.groom}
              alt="Groom Karthik M."
              monogram="K"
              subtitle="Karthik M."
            />
            <div className="gallery-badge">The Groom · Karthik M.</div>
          </figure>

          <div className="gallery-ritual">
            <h4>ಸಪ್ತಪದಿ · Saptapadi</h4>
            <p>Seven sacred steps taken together with vows of love, trust, mutual respect, and lifelong devotion.</p>
            <span className="kannada-sub">ಏಕಮೇಕಂ ಅನುಷ್ಠಾನಂ · ಸಪ್ತಪದಿ ಭವ ಸುಪ್ರೀತಾ</span>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="venue" id="venue">
        <div className="venue-copy">
          <SectionHeading eyebrow="The gathering place" title="Celebrate With Us" />
          <div className="venue-address">
            <Icon name="pin" />
            <p>
              <strong>
                Shree Guddada Malleshwara
                <br />
                Samudaya Bhavana
              </strong>
              <span>
                Mallapura, Bhadravathi Taluk,
                <br />
                Karnataka.
              </span>
            </p>
          </div>
          <a
            className="button"
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get directions to Shree Guddada Malleshwara Samudaya Bhavana"
          >
            <span>Get directions</span>
            <Icon name="arrow" />
          </a>
        </div>

        <div className="map-placeholder">
          <div className="map-lines" />
          <span>
            <Icon name="pin" />
          </span>
          <p>
            Shree Guddada Malleshwara
            <br />
            <small>Mallapura · Bhadravathi Taluk, Karnataka</small>
          </p>
          <a
            className="map-cta"
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open location in Google Maps"
          >
            <Icon name="external" />
            <span>Open in Google Maps</span>
          </a>
        </div>
      </section>

      {/* Closing & Sharing Section */}
      <section className="closing">
        <div className="closing-ornament">❦</div>
        <p className="eyebrow">With love and blessings</p>
        <div className="closing-names">
          Karthik M. <i>&amp;</i> Thejashwini M.H.
        </div>
        <Ornament />
        <p>
          We look forward to celebrating
          <br />
          this special occasion with you.
        </p>

        {/* Sharing Options (WhatsApp + Copy Link) */}
        <div className="share-group">
          <a
            className="share"
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share wedding invitation on WhatsApp"
          >
            <Icon name="share" />
            <span>Share via WhatsApp</span>
          </a>

          <button
            className="share"
            onClick={handleCopyLink}
            aria-label="Copy invitation link"
            type="button"
          >
            <Icon name={copied ? 'check' : 'copy'} />
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        <footer>
          <span>14–15 November 2026</span>
          <span>K · T</span>
          <span>Mallapura, Karnataka</span>
        </footer>
      </section>

      {/* Functional Music Floating Dock */}
      <div className="music-dock" role="region" aria-label="Music Player Controls">
        <button
          className="music-dock-btn"
          onClick={togglePlayMusic}
          aria-label={isPlaying ? 'Pause background wedding music' : 'Play background wedding music'}
        >
          <div className={`audio-visualizer ${isPlaying ? 'playing' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <Icon name={isPlaying ? 'pause' : 'music'} />
          <span>{isPlaying ? 'Pause' : 'Play Music'}</span>
        </button>

        <div className="music-divider" />

        <button
          className="music-dock-btn"
          onClick={toggleMuteMusic}
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <Icon name={isMuted ? 'volumeX' : 'volume'} />
        </button>

        {audioErrorNotice && (
          <div className="music-toast" role="alert">
            {audioErrorNotice}
          </div>
        )}
      </div>

      {/* Copy notification toast */}
      {copied && (
        <div className="copy-toast" role="status">
          ✓ Invitation link copied to clipboard
        </div>
      )}
    </main>
  )
}
