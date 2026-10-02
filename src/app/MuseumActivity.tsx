'use client'

import { useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowDown, ArrowUpRight, Check, Grip, RotateCcw, X } from 'lucide-react'
import styles from './MuseumActivity.module.css'

interface ArtifactItem {
  id: string
  name: string
  icon: string
  momentId: string
  shortDesc: string
  exactQuote: string
  novelPage: string
  howItEnded: string
}

interface DiscoveryMoment {
  id: string
  title: string
  description: string
  icon: string
  order: number
}

interface MuseumActivityProps {
  artifacts: ArtifactItem[]
  moments: DiscoveryMoment[]
}

function ArtifactCard({
  artifact,
  index,
  isMatched,
  isSelected,
  onSelect,
  onShowDetail,
}: {
  artifact: ArtifactItem
  index: number
  isMatched: boolean
  isSelected: boolean
  onSelect: () => void
  onShowDetail: (trigger: HTMLButtonElement) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: artifact.id,
    disabled: isMatched,
  })

  const activate = (trigger: HTMLButtonElement) => {
    if (isMatched) onShowDetail(trigger)
    else onSelect()
  }

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...(isMatched ? {} : listeners)}
      aria-disabled={undefined}
      aria-pressed={isMatched ? undefined : isSelected}
      aria-describedby={isMatched ? undefined : attributes['aria-describedby']}
      aria-roledescription={isMatched ? undefined : 'pieza del archivo'}
      aria-label={`${artifact.name}. ${artifact.shortDesc}. ${artifact.novelPage}. ${isMatched ? 'Abrir ficha' : isSelected ? 'Pieza seleccionada; deseleccionar' : 'Seleccionar pieza'}`}
      onClick={(event) => activate(event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          activate(event.currentTarget)
        }
      }}
      className={[
        styles.artifactCard,
        isMatched ? styles.artifactMatched : '',
        isSelected ? styles.artifactSelected : '',
        isDragging ? styles.artifactDragging : '',
      ].join(' ')}
    >
      <span className={styles.cardMetadata}>
        <span>Pieza {String(index + 1).padStart(2, '0')}</span>
        <span>{artifact.novelPage}</span>
      </span>
      <span className={styles.artifactIcon} aria-hidden="true">{artifact.icon}</span>
      <span className={styles.artifactName}>{artifact.name}</span>
      <span className={styles.artifactDescription}>{artifact.shortDesc}</span>
      <span className={styles.cardAction}>
        {isMatched ? <><Check size={14} aria-hidden="true" /> Abrir ficha <ArrowUpRight size={14} aria-hidden="true" /></> :
          isSelected ? <><Check size={14} aria-hidden="true" /> Seleccionada</> :
            <><Grip size={14} aria-hidden="true" /> Seleccionar o arrastrar</>}
      </span>
    </button>
  )
}

function MomentCard({
  moment,
  matchedArtifacts,
  total,
  canPlace,
  onPlace,
  onShowDetail,
}: {
  moment: DiscoveryMoment
  matchedArtifacts: ArtifactItem[]
  total: number
  canPlace: boolean
  onPlace: () => void
  onShowDetail: (artifact: ArtifactItem, trigger: HTMLButtonElement) => void
}) {
  const { isOver, setNodeRef } = useDroppable({ id: moment.id })
  const complete = total > 0 && matchedArtifacts.length === total

  return (
    <article
      ref={setNodeRef}
      className={[
        styles.momentCard,
        canPlace ? styles.momentAvailable : '',
        isOver ? styles.momentOver : '',
        complete ? styles.momentComplete : '',
      ].join(' ')}
    >
      <button
        type="button"
        className={styles.momentTarget}
        disabled={!canPlace}
        onClick={onPlace}
        aria-label={`${moment.title}. ${moment.description} ${matchedArtifacts.length} de ${total} piezas colocadas.${canPlace ? ' Colocar la pieza seleccionada.' : ''}`}
      >
        <span className={styles.momentMetadata}>
          <span className={styles.momentNumber}>{String(moment.order).padStart(2, '0')}</span>
          <span className={styles.momentCount}>
            {complete && <Check size={12} aria-hidden="true" />}
            {matchedArtifacts.length} / {total}
          </span>
        </span>
        <span className={styles.momentTitle}>{moment.title}</span>
        <span className={styles.momentDescription}>{moment.description}</span>
        <span className={styles.momentHint}>
          <span aria-hidden="true">{moment.icon}</span>
          {canPlace ? 'Tocá para colocar la pieza' : 'Momento de la novela'}
        </span>
      </button>
      {matchedArtifacts.length > 0 && (
        <div className={styles.matchedList}>
          {matchedArtifacts.map((artifact) => (
            <button
              key={artifact.id}
              type="button"
              onClick={(event) => onShowDetail(artifact, event.currentTarget)}
              className={styles.matchedPiece}
              aria-label={`Abrir ficha: ${artifact.name}, ${artifact.novelPage}`}
            >
              <span aria-hidden="true">{artifact.icon}</span>
              <span className={styles.matchedName}>{artifact.name}<span>{artifact.novelPage}</span></span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </article>
  )
}

export default function MuseumActivity({ artifacts, moments }: MuseumActivityProps) {
  const [matched, setMatched] = useState<Record<string, string[]>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [detailArtifact, setDetailArtifact] = useState<ArtifactItem | null>(null)
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'retry'; message: string } | null>(null)
  const detailTrigger = useRef<HTMLButtonElement | null>(null)
  const suppressClickUntil = useRef(0)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
  )

  const matchedIds = Object.values(matched).flat()
  const selectedArtifact = artifacts.find((artifact) => artifact.id === selectedId)
  const dragArtifact = artifacts.find((artifact) => artifact.id === activeDragId)
  const progress = artifacts.length > 0 ? Math.round((matchedIds.length / artifacts.length) * 100) : 0
  const allComplete = artifacts.length > 0 && matchedIds.length === artifacts.length

  const placeArtifact = (artifactId: string, momentId: string) => {
    const artifact = artifacts.find((item) => item.id === artifactId)
    const moment = moments.find((item) => item.id === momentId)
    if (!artifact || !moment || matchedIds.includes(artifactId)) return

    if (artifact.momentId === momentId) {
      setMatched((previous) => {
        const current = previous[momentId] || []
        return current.includes(artifactId) ? previous : { ...previous, [momentId]: [...current, artifactId] }
      })
      setSelectedId(null)
      setFeedback({ kind: 'success', message: `${artifact.name}: pieza colocada en “${moment.title}”. Ya podés abrir su ficha.` })
    } else {
      setSelectedId(artifactId)
      setFeedback({ kind: 'retry', message: 'Esta pieza pertenece a otro momento. Volvé al texto y probá otra vez.' })
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id))
    setSelectedId(null)
    setFeedback(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null)
    suppressClickUntil.current = performance.now() + 250
    if (event.over) placeArtifact(String(event.active.id), String(event.over.id))
  }

  const showDetail = (artifact: ArtifactItem, trigger: HTMLButtonElement) => {
    if (performance.now() < suppressClickUntil.current) return
    detailTrigger.current = trigger
    setDetailArtifact(artifact)
  }

  const resetGame = () => {
    setMatched({})
    setSelectedId(null)
    setActiveDragId(null)
    setDetailArtifact(null)
    setFeedback(null)
  }

  return (
    <section className={styles.museum} aria-labelledby="museum-heading">
      <div className={styles.intro}>
        <div>
          <p className="eyebrow">Archivo de la expedición</p>
          <h2 id="museum-heading" className="section-title">Museo de Piezas</h2>
          <p className="body-copy">Tocá una pieza y después tocá el momento donde aparece. También podés arrastrarla.</p>
        </div>
        <div className={styles.progressPanel}>
          <div className={styles.progressSummary}>
            <span><strong>{matchedIds.length}</strong> / {artifacts.length} piezas colocadas</span>
            <span className={styles.progressPercent}>{progress}%</span>
          </div>
          <div
            className={styles.progressTrack}
            style={{ gridTemplateColumns: `repeat(${Math.max(artifacts.length, 1)}, 1fr)` }}
            role="progressbar"
            aria-label="Piezas colocadas"
            aria-valuenow={matchedIds.length}
            aria-valuemin={0}
            aria-valuemax={artifacts.length}
          >
            {artifacts.map((artifact, index) => <span key={artifact.id} className={index < matchedIds.length ? styles.progressFilled : ''} />)}
          </div>
          <button type="button" onClick={resetGame} className={styles.resetButton}><RotateCcw size={13} aria-hidden="true" /> Reiniciar</button>
        </div>
      </div>

      <div className={styles.selectionBar}>
        {selectedArtifact ? (
          <>
            <span className={styles.selectionIcon} aria-hidden="true">{selectedArtifact.icon}</span>
            <div className={styles.selectionText}><span>Pieza seleccionada</span><strong>{selectedArtifact.name}</strong></div>
            <a href="#museum-moments" className={styles.jumpLink}>Ir a los momentos <ArrowDown size={14} aria-hidden="true" /></a>
            <button type="button" onClick={() => setSelectedId(null)} className={styles.clearSelection} aria-label="Deseleccionar pieza"><X size={17} aria-hidden="true" /></button>
          </>
        ) : (
          <><span className={styles.stepNumber}>1</span><span className={styles.selectionInstruction}>{allComplete ? 'Todas las piezas están colocadas. Explorá sus fichas.' : 'Elegí una pieza del archivo para empezar.'}</span><span className={styles.keyboardHint}>También con Enter o Espacio</span></>
        )}
      </div>

      <div aria-live="polite" aria-atomic="true" className={styles.feedbackRegion}>
        {feedback && <p className={`${styles.feedback} ${feedback.kind === 'retry' ? styles.retryFeedback : styles.successFeedback}`}>{feedback.kind === 'success' && <Check size={15} aria-hidden="true" />}{feedback.message}</p>}
        {allComplete && <p className={styles.completeMessage}><Check size={16} aria-hidden="true" /><strong>Colección completa.</strong> Las {artifacts.length} piezas ya tienen su lugar en la novela.</p>}
      </div>

      <DndContext
        id="doncella-museum"
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveDragId(null)}
        accessibility={{ screenReaderInstructions: { draggable: 'Para vincular una pieza con teclado, presioná Enter o Espacio para seleccionarla. Luego recorré los momentos con Tab y presioná Enter en el que corresponda.' } }}
      >
        <div className={styles.workspace}>
          <div className={styles.inventory}>
            <div className={styles.areaHeading}><h3>Piezas por colocar</h3><span>{artifacts.length - matchedIds.length} disponibles</span></div>
            <p className={styles.inventoryHint}>Desplazá el archivo para ver todas las piezas.</p>
            <div className={styles.artifactGrid} role="region" aria-label="Archivo de piezas">
              {artifacts.map((artifact, index) => (
                <ArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  index={index}
                  isMatched={matchedIds.includes(artifact.id)}
                  isSelected={selectedId === artifact.id}
                  onSelect={() => {
                    if (performance.now() < suppressClickUntil.current) return
                    setSelectedId((previous) => previous === artifact.id ? null : artifact.id)
                    setFeedback(null)
                  }}
                  onShowDetail={(trigger) => showDetail(artifact, trigger)}
                />
              ))}
            </div>
          </div>
          <div id="museum-moments" className={styles.moments}>
            <div className={styles.areaHeading}><h3>Momentos de la novela</h3><span>{moments.length} momentos</span></div>
            <div className={styles.momentGrid}>
              {moments.map((moment) => (
                <MomentCard
                  key={moment.id}
                  moment={moment}
                  matchedArtifacts={artifacts.filter((artifact) => (matched[moment.id] || []).includes(artifact.id))}
                  total={artifacts.filter((artifact) => artifact.momentId === moment.id).length}
                  canPlace={!!selectedId}
                  onPlace={() => { if (selectedId) placeArtifact(selectedId, moment.id) }}
                  onShowDetail={showDetail}
                />
              ))}
            </div>
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          {dragArtifact && <div className={styles.dragOverlay}><span aria-hidden="true">{dragArtifact.icon}</span><div><strong>{dragArtifact.name}</strong><p>{dragArtifact.shortDesc}</p></div></div>}
        </DragOverlay>
      </DndContext>

      <Dialog.Root open={!!detailArtifact} onOpenChange={(open) => { if (!open) setDetailArtifact(null) }}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.modalOverlay} />
          <Dialog.Content
            className={styles.modalContent}
            onCloseAutoFocus={(event) => { event.preventDefault(); detailTrigger.current?.focus() }}
          >
            {detailArtifact && (
              <>
                <div className={styles.modalHeader}>
                  <span className={styles.modalIcon} aria-hidden="true">{detailArtifact.icon}</span>
                  <div><p className={styles.modalEyebrow}>Ficha de archivo · {detailArtifact.novelPage}</p><Dialog.Title className={styles.modalTitle}>{detailArtifact.name}</Dialog.Title><Dialog.Description className={styles.modalDescription}>{detailArtifact.shortDesc}</Dialog.Description></div>
                </div>
                <Dialog.Close className={styles.modalClose} aria-label="Cerrar ficha"><X size={21} aria-hidden="true" /></Dialog.Close>
                <div className={styles.quotePanel}>
                  <h4>Fragmento exacto de la novela</h4>
                  <blockquote>&ldquo;{detailArtifact.exactQuote}&rdquo;</blockquote>
                  <p className={styles.quotePage}>{detailArtifact.novelPage}</p>
                </div>
                <div className={styles.burialPanel}>
                  <h4>Cómo terminó en el entierro de la Doncella</h4>
                  <p>{detailArtifact.howItEnded}</p>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}
