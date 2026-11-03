interface UpdatedTimeProps {
  date: Date
}

export const UpdatedTime = ({ date }: UpdatedTimeProps) => (
  <>
    Updated <time dateTime={date.toISOString()}>{date.toUTCString()}</time>
  </>
)
