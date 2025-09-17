interface SectionTitleProps {
  title: string;
  subtitle?: string;
  button?: React.ReactNode;
  backButton?: React.ReactNode;
}

function SectionTitle({ title, subtitle, button, backButton } : SectionTitleProps) {
  return (
    <section className="flex justify-between">
      <div>
        <div className="flex">
          {backButton && backButton}
          <h3 className="text-3xl font-bold">{title}</h3>
        </div>
        {subtitle && <p className="text-base font-medium text-gray-600">{subtitle}</p>}
      </div>
      {button && <div>{button}</div>}
    </section>
  )
}

export default SectionTitle;
