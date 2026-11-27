import { adminPageHeader, adminPageTitle } from "@/utils/admin/styles"
import { mutedText } from "@/utils/styles"

export const AdminPageHeader = ({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: React.ReactNode
}) => (
  <header className={adminPageHeader}>
    <div className="flex flex-col gap-1">
      <h1 className={adminPageTitle}>{title}</h1>
      {description && <p className={mutedText}>{description}</p>}
    </div>
    {children}
  </header>
)
