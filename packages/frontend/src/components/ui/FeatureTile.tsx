interface FeatureTileProps {
  title: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
  points?: number
  disabled?: boolean
}

export function FeatureTile({
  title,
  description,
  checked,
  onChange,
  points,
  disabled = false,
}: FeatureTileProps) {
  return (
    <label className="cm-feature">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="cm-feature-card">
        {points !== undefined && <span className="cm-feature-points">+{points}</span>}
        <b>{title}</b>
        <small>{description}</small>
      </span>
    </label>
  )
}
