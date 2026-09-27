export default function PageState({
  loading,
  error,
  empty,
  emptyLabel,
  children,
}: {
  loading: boolean;
  error: boolean;
  empty?: boolean;
  emptyLabel?: string;
  children: React.ReactNode;
}) {
  if (loading) return <p className="state">Loading…</p>;
  if (error) {
    return (
      <p className="state state-error" role="alert">
        The API is not reachable. Start the API, then refresh this page.
      </p>
    );
  }
  if (empty) return <p className="state">{emptyLabel || "Nothing here yet."}</p>;
  return <>{children}</>;
}
