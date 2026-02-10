require "digest"

class ApplicationController < ActionController::API
  around_action :reset_current_after_request

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity

  private

  def require_write_password
    provided_password = request.headers["X-GOGOLISTAN-WRITE-PASSWORD"].to_s
    expected_password = ENV["GOGOLISTAN_WRITE_PASSWORD"].to_s

    if provided_password.blank? || expected_password.blank?
      return render json: { error: "unauthorized" }, status: :unauthorized
    end

    unless secure_compare_strings(provided_password, expected_password)
      return render json: { error: "unauthorized" }, status: :unauthorized
    end

    Current.user = nil
  end

  def secure_compare_strings(a, b)
    a_digest = ::Digest::SHA256.hexdigest(a)
    b_digest = ::Digest::SHA256.hexdigest(b)
    ActiveSupport::SecurityUtils.secure_compare(a_digest, b_digest)
  end

  def render_not_found(error)
    render json: { error: error.message }, status: :not_found
  end

  def render_unprocessable_entity(error)
    render json: { errors: error.record.errors.full_messages }, status: :unprocessable_entity
  end

  def reset_current_user
    Current.reset
  end

  def reset_current_after_request
    yield
  ensure
    reset_current_user
  end
end
