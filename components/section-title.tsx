interface SectionTitleProps {
  title: string;
  subtitle: string;
  button?: React.ReactNode;
}

function SectionTitle({ title, subtitle, button } : SectionTitleProps) {
  return (
    <section className="flex justify-between">
      <div>
        <h3 className="text-3xl font-bold">{title}</h3>
        <p className="text-base font-medium text-gray-600">{subtitle}</p>
      </div>
      {button && <div>{button}</div>}
    </section>
  )
}

export default SectionTitle;
