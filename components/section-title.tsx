interface SectionTitleProps {
  title: string;
  subtitle: string;
}

function SectionTitle({ title, subtitle } : SectionTitleProps) {
  return (
    <section>
      <h3 className="text-3xl font-bold">{title}</h3>
      <p className="text-base font-medium text-gray-600">{subtitle}</p>
    </section>
  )
}

export default SectionTitle;
