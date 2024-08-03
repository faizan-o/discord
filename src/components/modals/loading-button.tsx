import { Button } from "@/components/ui/button";
import { ScaleLoader } from "react-spinners";

const LoadingButton = ({
  isPending,
  label,
}: {
  isPending: boolean;
  label: string;
}) => {
  return (
    <Button type="submit" className="w-full py-4 my-4" disabled={isPending}>
      {isPending ? <ScaleLoader height={12} color="cyan" /> : label}
    </Button>
  );
};

export default LoadingButton;
