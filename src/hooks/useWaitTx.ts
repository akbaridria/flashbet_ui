import { useEffect } from "react";
import { toast } from "sonner";
import { useWaitForTransactionReceipt } from "wagmi";

interface UseWaitTxProps {
  hash?: `0x${string}`;
  callbackOnSuccess?: () => void;
}

const useWaitForTx = ({ hash, callbackOnSuccess }: UseWaitTxProps) => {
  const { data } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (data) {
      if (data?.status === "success") {
        toast.success("Transaction successful");
        callbackOnSuccess?.();
      } else {
        toast.error("Transaction failed");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
};

export default useWaitForTx;
